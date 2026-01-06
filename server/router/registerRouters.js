const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

async function registerUser(username, email, password_hash, image_url) {
  const result = await db.query(
    "INSERT INTO public.users (username, email, password_hash, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, email, password_hash, image_url]
  );
  return result.rows[0];
}

router.post("/register", async (req, res) => {
 let { username, email, password } = req.body;

username = username.toLowerCase();
email = req.body.email.toLowerCase(); 


  try {
    const image_url = `${username}.png`;

    const existingUser = await db.query(
      "SELECT * FROM public.users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered. Try logging in."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = await registerUser(
      username,
      email,
      hashedPassword,
      image_url
    );

    return res
      .status(201)
      .json({ message: "Registered Successfully!", user: newUser });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;
