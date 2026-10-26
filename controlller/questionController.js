const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbconfig");
const { randomUUID } = require("crypto");

async function listQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(`
      SELECT q.questionid, q.title, q.description,
             q.userid, u.username, COUNT(a.answerid) AS answerCount
      FROM questions q
      LEFT JOIN users u ON u.userid = q.userid
      LEFT JOIN answers a ON a.questionid = q.questionid
      GROUP BY q.id, q.questionid, q.title, q.description, q.userid, u.username
      ORDER BY q.id DESC
    `);
    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error("List questions failed:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Unable to load questions." });
  }
}

async function createQuestion(req, res) {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "A title and description are required." });
  }
  if (title.length > 70) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "The title must be 70 characters or fewer." });
  }
  if (description.length > 300) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "The description must be 300 characters or fewer." });
  }
  try {
    const questionid = randomUUID();
    const [result] = await dbConnection.query(
      "INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)",
      [questionid, Number(req.user.userid), title, description],
    );
    return res.status(StatusCodes.CREATED).json({
      msg: "Question posted successfully.",
      question: { id: result.insertId, questionid, title, description, userid: req.user.userid, username: req.user.username, answerCount: 0 },
    });
  } catch (error) {
    console.error("Create question failed:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Unable to post your question." });
  }
}

async function getQuestion(req, res) {
  const questionId = req.params.questionId;
  if (typeof questionId !== "string" || !questionId.trim()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid question id." });
  }
  try {
    const [rows] = await dbConnection.query(`
      SELECT q.id, q.questionid, q.title, q.description, q.userid, u.username
      FROM questions q LEFT JOIN users u ON u.userid = q.userid
      WHERE q.questionid = ?
    `, [questionId]);
    if (!rows.length) return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found." });

    const [answers] = await dbConnection.query(`
      SELECT a.answerid, a.answer, a.userid, u.username
      FROM answers a LEFT JOIN users u ON u.userid = a.userid
      WHERE a.questionid = ? ORDER BY a.answerid ASC
    `, [questionId]);
    return res.status(StatusCodes.OK).json({ question: rows[0], answers });
  } catch (error) {
    console.error("Get question failed:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Unable to load this question." });
  }
}

async function createAnswer(req, res) {
  const questionId = req.params.questionId;
  const answer = typeof req.body.answer === "string" ? req.body.answer.trim() : "";
  if (typeof questionId !== "string" || !questionId.trim()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid question id." });
  }
  if (!answer) return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Answer text is required." });
  if (answer.length > 300) return res.status(StatusCodes.BAD_REQUEST).json({ msg: "An answer must be 300 characters or fewer." });
  try {
    const [questionRows] = await dbConnection.query("SELECT questionid FROM questions WHERE questionid = ?", [questionId]);
    if (!questionRows.length) return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found." });
    const answerid = randomUUID();
    await dbConnection.query(
      "INSERT INTO answers (answerid, userid, questionid, answer) VALUES (?, ?, ?, ?)",
      [answerid, Number(req.user.userid), questionId, answer],
    );
    return res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully.",
      answer: { answerid, questionid: questionId, userid: req.user.userid, username: req.user.username, answer },
    });
  } catch (error) {
    console.error("Create answer failed:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Unable to post your answer." });
  }
}

module.exports = { listQuestions, createQuestion, getQuestion, createAnswer };
