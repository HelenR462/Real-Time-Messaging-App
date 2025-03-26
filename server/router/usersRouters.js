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
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const loggedInUserId = decoded.user_id;

      // fetch all users except the logged-in user
      const result = await db.query("SELECT user_id,username,image_url FROM public.users");

    
      const baseImagePath = "http://localhost:5000/assets/images/";
    
      const defaultImage = "default.png";

      const usersWithImages = result.rows.map((user) => ({
        ...user,
        image_url: user.image_url
          ? `${baseImagePath}${user.image_url}`
          : `${baseImagePath}${defaultImage}`, 
        }));
      
      // console.log("Users API Response:", usersWithImages);

      res.json(usersWithImages);
      // res.json(result.rows);
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", async (req, res) => {
  const { username } = req.body;

  // console.log("Incoming request body:", req.body);

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
  // console.log("Received userId:", req.params.id);

  try {
    const result = await db.query("SELECT * FROM users");

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
