const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

async function findUser(email) {
  const result = await db.query(
    "SELECT user_id, username, email, password_hash FROM public.users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", req.body);

    const user = await findUser(email);
    console.log("User found in database:", user);

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    const passwordIsMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordIsMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error.message);

    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(500).json({ message: "Internal server error during login" });
  }
});

module.exports = router;
