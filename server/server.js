const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

require("dotenv").config();

const loginRoutes = require("./router/loginRouters");
const registerRoutes = require("./router/registerRouters");
const messagesRoutes = require("./router/messagesRouters");
const usersRoutes = require("./router/usersRouters");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", messagesRoutes);
app.use("/api", usersRoutes);

// console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
// console.log(
//   "DATABASE_URL starts with:",
//   process.env.DATABASE_URL
//     ? process.env.DATABASE_URL.substring(0, 20)
//     : "NOT SET",
// );

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,

  // connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL database");
    client.release();
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err);
    console.error("PG error message:", err.message);
    console.error("PG error code:", err.code);
    process.exit(1);
  });
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    console.log(`User ${userId} joined with socket ${socket.id}`);
    socket.join(String(userId));
  });

  socket.on("send_message", (message) => {
    console.log("Message received:", message);

    console.log("socket send:", message);

    console.log("Sending to sender room:", String(message.sender_id));
    console.log("Sending to receiver room:", String(message.receiver_id));

    io.to(String(message.sender_id)).emit("receive_message", message);
    io.to(String(message.receiver_id)).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
