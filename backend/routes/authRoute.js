const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();
// Middleware to check if the token is valid
router.get("/check", (req, res) => {
  const token = req.cookies.token; // Assuming the token is set in a HttpOnly cookie

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Verify the token using a secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // If token is valid, proceed to the next middleware or send a successful response
    res.status(200).json({ message: "Authenticated" });
  });
});

module.exports = router;
