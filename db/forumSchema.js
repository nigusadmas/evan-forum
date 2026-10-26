const dbConnection = require("./dbconfig");
const { randomUUID } = require("crypto");

async function ensureForumTables() {
  await dbConnection.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      questionid VARCHAR(200) NOT NULL UNIQUE,
      userid INT NOT NULL,
      title VARCHAR(70) NOT NULL,
      description VARCHAR(300) NOT NULL,
      tag VARCHAR(40) DEFAULT NULL,
      INDEX questions_userid_idx (userid)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await dbConnection.query(`
    CREATE TABLE IF NOT EXISTS answers (
      answerid VARCHAR(200) NOT NULL PRIMARY KEY,
      questionid VARCHAR(200) NOT NULL,
      userid INT NOT NULL,
      answer VARCHAR(300) NOT NULL,
      INDEX answers_questionid_idx (questionid),
      INDEX answers_userid_idx (userid)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Older rows can have a blank questionid. Give each one a stable ID so
  // question links and existing answers can point to it reliably.
  const [questionsWithoutId] = await dbConnection.query(
    "SELECT id FROM questions WHERE questionid IS NULL OR questionid = ''",
  );
  for (const question of questionsWithoutId) {
    const questionid = randomUUID();
    await dbConnection.query(
      "UPDATE answers SET questionid = ? WHERE questionid = ''",
      [questionid],
    );
    await dbConnection.query(
      "UPDATE questions SET questionid = ? WHERE id = ?",
      [questionid, question.id],
    );
  }
}

module.exports = ensureForumTables;
