const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

router.post("/register", async (req, res) => {
  console.log("Help!");
  const { username, email, password } = req.body;

  try {
    const isUserExisting = await db.query(
      "SELECT * FROM user WHERE email = $1",
      [email]
    );

    if (isUserExisting.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Email already registered. Try Logging in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO user (username, email, hashedPassword"
    );
    res.json({ user: newUser.rows });
    return res.status(201).json({ message: "Registered Successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
