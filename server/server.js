const express = require("express");
const app = express();
const cors = require("cors");
const { Pool } = require("pg");
const loginRoutes = require("./router/loginRouters");
const registerRoutes = require("./router/registerRouters");
const chatRoutes = require("./router/chatRouters");
const userRoutes = require("./router/userRouters");

require("dotenv").config();

const port = 3001;

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", chatRoutes);
app.use("/api", userRoutes);

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

pool.connect().then(() => {
  console.log("Connected to PostgreSQL database");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
