const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.authToken || req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

router.get("/messages", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM public.messages`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messages", verifyToken, async (req, res) => {
  const { chatUser, user_message } = req.body;
  const userId = req.user?.user_id;
  const created_date = new Date();

  if (!chatUser) {
    return res.status(400).json({ error: "chatUser is required" });
  }

  if (!userId) {
    return res.status(401).json({ msg: "User ID missing from token" });
  }

  try {
    const result = await db.query(
      // "INSERT INTO messages (user_id, user_message) VALUES ($1, $2) RETURNING *",
      // [userId, chatUser]

      `INSERT INTO messages (user_id, receiver_id, user_message, created_date)
      VALUES ($1, $2, $3, $4)`,
     [user_id, receiver_id, user_message, created_date]

    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages/:user_id", verifyToken, async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at ASC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages by user_id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
