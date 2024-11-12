const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

async function findUser(id) {
  try {
    const result = await db.query("SELECT * FROM public.user WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user from database:", error);
    throw new Error("Database query error");
  }
}

router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await findUser(decoded.id);
      if (user) {
        res.json({ user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/user", async (req, res) => {
  const { username } = req.body;

  console.log("Incoming request body:", req.body);

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const result = await db.query("SELECT * FROM public.user WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      console.log(`User with username ${username} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0]; 
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
