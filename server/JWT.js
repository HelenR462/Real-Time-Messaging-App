const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verifyToken(token, process.env.SECRET_KEY);
    req.newUser = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};


const generateToken = (req, res) => {
  const user = req.user; 

  if (!user) {
    return res.status(400).json({ msg: "User not provided" });
  }
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000,
    sameSite: "strict",
  });
  res.status(200).json({ msg: "Token generated and cookie set" });
};

module.exports = { verifyToken, generateToken };
