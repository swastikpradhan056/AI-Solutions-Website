require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const softwareSolutionRoutes = require("./routes/softwareSolutionRoutes");
const pastSolutionRoutes = require("./routes/pastSolutionRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const upcomingEventRoutes = require("./routes/upcomingEventRoutes");
const photoGalleryRoutes = require("./routes/photoGalleryRoutes");
// const { authMiddleware } = require("./middlewares/authMiddleware"); // Import the auth middleware
const aboutRoutes = require("./routes/aboutRoutes");
const authRoute = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const path = require("path");
// Create default admin if it doesn't exist
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin"); // Assuming this is the path to your Admin model
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  methods: "GET,POST,PUT,DELETE", // Allowed methods
  credentials: true, // Allow credentials (cookies)
};

// Create default admin
Admin.createDefaultAdmin();

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(compression());

// Database connection
connectDB();

// Routes
// Public routes
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/software-solutions", softwareSolutionRoutes);
app.use("/api/past-solutions", pastSolutionRoutes);
app.use("/api/events", upcomingEventRoutes);
app.use("/api/photos", photoGalleryRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/auth", authRoute);

// Admin routes (protected by authMiddleware)
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
