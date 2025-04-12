const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const cookieToken = req.cookies?.authToken;
  const token = cookieToken || (authHeader && authHeader.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      console.log("Authenticated user:", decoded);
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const generateToken = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ msg: "User not provided" });
  }

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000,
    sameSite: "strict",
  });

  res.status(200).json({ msg: "Token generated and cookie set", token });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken, generateToken, authenticateToken };
