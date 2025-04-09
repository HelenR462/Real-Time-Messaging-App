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
        "SELECT user_id, username, image_url FROM public.users WHERE user_id IS NOT NULL AND user_id != $1",
        [loggedInUserId]
      );

      const defaultImage = "default.png";

      console.log("Raw DB users:", result.rows);

      const usersWithImages = result.rows.map((user) => {
        const fileName = user.image_url?.trim();
        const isValid =
          fileName && !fileName.includes("/") && fileName.includes(".png");

        return {
          ...user,
          image_url: isValid
            ? `/public/assets/images/${fileName}`
            : `/public/assets/images/${defaultImage}`,
        };
      });

      res.json(usersWithImages);
    } catch (err) {
      console.error("JWT verification failed:", err.message);
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
