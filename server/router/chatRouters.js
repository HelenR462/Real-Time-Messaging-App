const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;


async function findMessage(message) {
  const result = await db.query("SELECT * FROM messages WHERE chat = $1", [
   message,
  ]);
  return result.rows[0];
}


router.post("/create-chat", async (req, res) => {

  console.log("connecting create-chat")
})