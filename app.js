require("dotenv").config();
// const dotenv=

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5500;
const cors = require("cors");

const allowedOrigins = process.env.FRONTEND_URL?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : true }));

const dbConnection = require("./db/dbconfig");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Routes
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const ensureForumTables = require("./db/forumSchema");
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);

async function start() {
  try {
    await dbConnection.execute("SELECT 'test'");
    await ensureForumTables();
    console.log("Database Connection Established");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
}

start();
