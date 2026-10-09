require("dotenv").config();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const parsedUrl = new URL(connectionString);

console.log("DB hostname:", parsedUrl.hostname);
console.log("DB database:", parsedUrl.pathname);
console.log("DB username:", parsedUrl.username);
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
