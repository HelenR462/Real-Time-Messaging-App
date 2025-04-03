const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

async function registerUser(username, email, passwordhush) {
  const defaultImageURL = "/public/assets/images/default.png"

  const result = await db.query(
    "INSERT INTO public.users (username, email, passwordhush, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, email, passwordhush, defaultImageURL]
  );
  return result.rows[0];
}

// Define the route for user registration
router.post("/register", async (req, res) => {
  let { username, email, password } = req.body;

  username = username.toLowerCase();
  email = email.toLowerCase();

  try {
    // Check if user with this email already exists
    const existingUser = await db.query(
      // "SELECT * FROM public.users WHERE (username, email) = $1 ,$2",
      // (LOWER(username, email) = LOWER($1, $2)),
      // [username, email]

       "SELECT * FROM public.users WHERE LOWER(email) = LOWER($1) OR    LOWER(username) = LOWER($2)",
       [email, username]
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
    return res
      .status(201)
      .json({ message: "Registered Successfully!", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
