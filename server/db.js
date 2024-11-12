const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

// const client = new Client({
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   port: process.env.PORT || 5432,
// });

// client.connect()
//    .then(() => {
//         console.log("Connected to PostgreSQL database")
//    .catch((err) => err.message("not found"))
//    .finally(() => client.end());
// });

// module.exports = client;

// module.exports = pool;

module.exports = {
  query: (text, params) => pool.query(text, params),
};
