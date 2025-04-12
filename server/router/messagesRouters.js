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
  const { chatUser, text } = req.body;
  const userId = req.user?.user_id;

  if (!chatUser) {
    return res.status(400).json({ error: "chatUser is required" });
  }

  if (!userId) {
    return res.status(401).json({ msg: "User ID missing from token" });
  }

  try {
    const result = await db.query(
      "INSERT INTO messages (user_id, user_message) VALUES ($1, $2) RETURNING *",
      [userId, chatUser]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
