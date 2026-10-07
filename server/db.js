const { Pool } = require("pg");
require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
  const parsed = new URL(dbUrl);

  console.log("DB USER:", parsed.username);
  console.log("DB HOST:", parsed.hostname);
  console.log("DB PORT:", parsed.port);
  console.log("DB NAME:", parsed.pathname);
} else {
  console.log("DATABASE_URL is NOT SET");
}

const pool = new Pool({
  connectionString: dbUrl,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

module.exports = pool;

// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   port: process.env.PORT,
// });

// module.exports = pool;
