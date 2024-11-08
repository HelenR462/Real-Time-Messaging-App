const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

// Define findUser
async function findUser(email) {
  const result = await db.query("SELECT * FROM public.user WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const passwordIsMatch = await bcrypt.compare(password, user.passwordhush);
    if (!passwordIsMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // Generate token using the correct `user_id`
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Internal server error during login" });
  }
});

module.exports = router;
