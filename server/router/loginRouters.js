const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;

// Define findUser
async function findUser(email) {
  const result = await db.query("SELECT * FROM user WHERE email = $1", [email]);
  return result.rows[0];
}

// Login route
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify password
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Error logging in!" });
  }
});

module.exports = router;
