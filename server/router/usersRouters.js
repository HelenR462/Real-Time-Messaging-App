const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

async function findUser(user_id) {
  try {
    const result = await db.query(
      "SELECT * FROM public.users WHERE user_id = $1",
      [user_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user from database:", error);
    throw new Error("Database query error");
  }
}

router.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const loggedInUserId = parseInt(req.user_id, 10);

    if (!req.user || isNaN(req.user.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    // fetch all users except the logged-in user
    const result = await db.query(
      "SELECT * FROM public.users WHERE user_id != $1",
      [loggedInUserId]
    );
    console.log("Received userId:", typeof loggedInUserId, loggedInUserId);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", async (req, res) => {
  const { username } = req.body;

  console.log("Incoming request body:", req.body);

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM public.users WHERE username = $1",
      [username]
    );

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

router.get("/user/:id", async (req, res) => {
  const user_id = req.params.id;
  console.log("Received userId:", req.params.id);

  try {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
