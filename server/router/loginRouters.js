const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

async function findUser(email) {
  const result = await db.query("SELECT * FROM public.users WHERE email = $1", [
    email,
  ]);
  return result.rows;
}

router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  try {
    const { email, password } = req.body;
    const user = (await findUser(email))[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordIsMatch = await bcrypt.compare(password, user.passwordhush);
    if (!passwordIsMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
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
    res.status(500).json({ message: "Internal server error during login" });
  }
});

module.exports = router;
