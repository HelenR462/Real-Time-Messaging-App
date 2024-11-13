const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/messages", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM public.messages");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messages", async (req, res) => {
  const { chatUser } = req.body;

  console.log(req.body)

  if (!chatUser) {
    return res.status(400).json({ error: "ChatUser is required" });
  }

  res.json({ message: `Chat created for user ${chatUser}` });

  try {
    const newChat = await db.query(
      "INSERT INTO public.messages (user_id, user_message) VALUES ($1, $2) RETURNING *",
      [user_id, user_message]
    );
    res.status(201).json(newChat.rows[0]);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
