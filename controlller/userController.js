const jwt = require("jsonwebtoken");

const dbConnection = require("../db/dbconfig");
const bycrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
//registeration functionality
async function registerUser(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  //check all the information is filled in the database
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required Information" });
  }

  //check the user is already exist in  the database using usename and email
  try {
    const [user] = await dbConnection.query(
      "SELECT username,userid From users WHERE username=? OR email=?",
      [username, email],
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already registered!" });
    }

    // check the password length is lessthan 8 or grater than 8
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters!" });
    }

    // Encrypt Password
    const salt = await bycrypt.genSalt(10);
    const hashPassword = await bycrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username,firstname,lastname,email,password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashPassword],
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User Registered Successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. please try again" });
  }
}

//Login functionality
async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required feilds" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username,userid,password FROM users WHERE email=?",
      [email],
    );
    // return res.json({ user: user });
    // check username and password correctly exists
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid Credential" });
    }

    // if it exists do the following
    // compare the database file and login and decrypt the password
    const isMatch = await bycrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid Credential" });
    }
    // return res.json({ user: user[0].password });
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "User login successfully!", token, username });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. please try again" });
  }
}

//check functionality
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res.status(StatusCodes.OK).json({
    msg: "Valid User",
    username,
    userid,
  });
}

module.exports = { registerUser, loginUser, checkUser };
