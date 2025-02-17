const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/messages", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM public.messages`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

router.post("/messages", authenticateToken, async (req, res) => {
  const { chatUser } = req.body;

  console.log(req.body);
  console.log("Sending request with data:", { chatUser });

  if (!chatUser) {
    return res.status(400).json({ error: "ChatUser is required" });
  }

  try {
    const user_id = req.user.id;

    console.log("Inserting into DB:", { user_id, chatUser });

    const newChat = await db.query(
      "INSERT INTO messages (user_id, user_message) VALUES ($1, $2) RETURNING *",
      [user_id, chatUser]
    );
    res.status(201).json(newChat.rows[0]);
  } catch (error) {
    setError(
      error.response?.data?.error || "Error creating chat. Please try again."
    );
    console.error("Error creating chat:", error.response?.data || error);

    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
