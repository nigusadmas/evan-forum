const express = require("express");
const router = express.Router();

//Authentication Middleware
const authMiddlewar = require("../Middleware/authMiddleware");

// ??user controllers
const {
  registerUser,
  loginUser,
  checkUser,
} = require("../controlller/userController");

//Register Route
router.post("/register", registerUser);

// login user
router.post("/login", loginUser);

// check user
router.get("/check", authMiddlewar, checkUser);

module.exports = router;
