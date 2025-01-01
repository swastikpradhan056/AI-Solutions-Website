const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
require("dotenv").config();

/**
 * @desc Middleware to protect admin routes
 * @access Private
 */
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Not authorized as admin" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid token. Access denied." });
  }
};

/**
 * @desc Middleware for stricter admin protection (Admin-only access)
 * @access Private (Admin only)
 */
const admin = (req, res, next) => {
  if (req.admin) {
    // If the user is authenticated as an admin, allow access
    next();
  } else {
    res.status(403).json({ message: "Access forbidden: Admins only" });
  }
};

module.exports = { authMiddleware, admin };
