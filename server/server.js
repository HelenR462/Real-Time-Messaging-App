const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

require("dotenv").config();

const loginRoutes = require("./router/loginRouters");
const registerRoutes = require("./router/registerRouters");
const messagesRoutes = require("./router/messagesRouters");
const usersRoutes = require("./router/usersRouters");

const port = 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", messagesRoutes);
app.use("/api", usersRoutes);

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});


pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err.message);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
