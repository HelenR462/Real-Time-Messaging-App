const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

async function registerUser(username, email, passwordhush) {
 
  
  const result = await db.query(
    "INSERT INTO public.users (username, email, passwordhush, image_url) VALUES ($1, $2, $3) RETURNING *",
    [username, email, passwordhush]
  );
  return result.rows[0];
}

// Define the route for user registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user with this email already exists
    const existingUser = await db.query(
      "SELECT * FROM public.users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Email already registered. Try Logging in." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register the user with hashed password
    const newUser = await registerUser(username, email, hashedPassword);

    // Send response
    return res.status(201).json({ message: "Registered Successfully!", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
