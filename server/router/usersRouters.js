const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");
const db = require("../db");
const SECRET_KEY = process.env.JWT_SECRET;
const { verifyToken } = require("../middleware/verifyToken");

router.get("/users", verifyToken, async (req, res) => {
  const loggedInUserId = req.user.user_id;

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
        image_url: fileName,
      };
    });

    res.json(usersWithImages);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
});

router.get("/user/:user_id", async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);

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

    const user = result.rows[0];
    res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        image_url: user.image_url,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
