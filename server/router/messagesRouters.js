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

router.get("/users/username/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM public.users WHERE LOWER(username) = LOWER($1)",
      [username],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user by username:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages", verifyToken, async (req, res) => {
  const loggedInUserId = req.user.user_id;
  const { selectedUserId } = req.query;

  if (!selectedUserId) {
    return res.status(400).json({ error: "selectedUserId is required" });
  }
  try {
    const result = await db.query(
      `
  SELECT 
    messages.id,
    messages.user_message,
    messages.sender_id,
    messages.receiver_id,
    messages.created_at,
    user.username AS sender_username,
    user.image_url AS sender_image
  FROM messages messages
  JOIN users user ON messages.sender_id = user.user_id
  WHERE (messages.sender_id = $1 AND messages.receiver_id = $2)
     OR (messages.sender_id = $2 AND messages.receiver_id = $1)
  ORDER BY messages.created_at ASC
`,
      [loggedInUserId, selectedUserId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messages", verifyToken, async (req, res) => {
  const { user_message, receiver_id } = req.body;
  const sender_id = req.user?.user_id;
  const created_at = new Date();

  if (!user_message || !receiver_id) {
    return res
      .status(400)
      .json({ error: "Message and receiver_id are required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, user_message, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sender_id, receiver_id, user_message, created_at],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages/:user_id", verifyToken, async (req, res) => {
  const { user_id } = req.params;

  if (parseInt(user_id, 10) !== req.user.user_id) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const result = await db.query(
      `SELECT * FROM public.messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at ASC`,
      [user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages by user_id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
