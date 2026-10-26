const mysql2 = require("mysql2");
const dbConnection = mysql2.createPool({
  user: process.env.DB_USER || process.env.USER,
  database: process.env.DB_NAME || process.env.DATABASE,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  password: process.env.DB_PASSWORD || process.env.PASSWORD,
  connectionLimit: 10,
});

// console.log(process.env.JWT_SECRET);
// console.log(process.env.USER);
// dbConnection.execute("SELECT 'Test'", (err, result) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(result);
//   }
// });

module.exports = dbConnection.promise();
