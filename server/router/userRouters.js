const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

async function findUser(id) {
  const result = await db.query("SELECT * FROM public.user WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
}

router.post("/user", async (req, res) => {
  console.log(req.body);
});
