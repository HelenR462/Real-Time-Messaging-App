require("dotenv").config();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

// const dbUrl = new URL(connectionString);

// console.log("PostgreSQL host:", dbUrl.hostname);
// console.log(
//   "PostgreSQL SSL mode:",
//   dbUrl.searchParams.get("sslmode") || "not specified",
// );

const parsedUrl = new URL(connectionString);

console.log("DB hostname:", parsedUrl.hostname);
console.log("DB SSL mode:", parsedUrl.searchParams.get("sslmode"));
console.log("SSL configuration enabled:", true);

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err.message, err.code);
});

module.exports = pool;
