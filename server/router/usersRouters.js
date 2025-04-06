const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const loggedInUserId = decoded.user_id;

      console.log("Logged-in user ID:", loggedInUserId);

      const result = await db.query(
        "SELECT user_id, username, image_url FROM public.users WHERE user_id != $1",
        [loggedInUserId]
      );

      const baseImagePath = "http://localhost:5000/assets/images/";
      const defaultImage = "default.png";

      const usersWithImages = result.rows.map((user) => ({
        ...user,
        image_url: user.image_url
          ? `${baseImagePath}${user.image_url}`
          : `${baseImagePath}${defaultImage}`,
      }));

      res.json(usersWithImages);
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM public.users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
