const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");
const db = require("../db");
const SECRET_KEY = process.env.JWT_SECRET;
const { authenticateToken } = require("../JWT");

router.get("/users", authenticateToken, async (req, res) => {
  const loggedInUserId = req.user.user_id;

  // console.log("Authenticated user:", req.user);
  // console.log("Logged-in user ID:", loggedInUserId);

  try {
    const result = await db.query(
      "SELECT user_id, username, image_url FROM public.users WHERE user_id IS NOT NULL AND user_id != $1",
      [loggedInUserId]
    );

    const defaultImage = "default.png";

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
