const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const {
  listQuestions,
  createQuestion,
  getQuestion,
  createAnswer,
} = require("../controlller/questionController");

const router = express.Router();

router.get("/", authMiddleware, listQuestions);
router.post("/", authMiddleware, createQuestion);
router.get("/:questionId", authMiddleware, getQuestion);
router.post("/:questionId/answers", authMiddleware, createAnswer);

module.exports = router;
