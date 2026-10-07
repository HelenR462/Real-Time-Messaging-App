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

const CLIENT_URL = process.env.CLIENT_URL;
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", messagesRoutes);
app.use("/api", usersRoutes);

app.get("/", (req, res) => {
  res.send("Real-Time Messaging Server is running!");
});

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
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

app.get("/", (req, res) => {
  res.send("Real-Time Messaging Server is running!");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
