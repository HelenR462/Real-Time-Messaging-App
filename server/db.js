// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   db_user: process.env.USER,
//   db_host: process.env.HOST,
//   db_database: process.env.DATABASE,
//   db_password: process.env.PASSWORD,
// });



// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

module.exports = pool;
