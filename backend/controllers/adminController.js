const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Inquiry = require("../models/Inquiry");
const Feedback = require("../models/Feedback");
const Solution = require("../models/SoftwareSolution");
const Event = require("../models/UpcomingEvent");
const Photo = require("../models/PhotoGallery");
const { default: mongoose } = require("mongoose");

/**
 * @desc Admin login
 * @route POST /api/admin/login
 * @access Public
 */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin with email not found:", email);
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Password mismatch for admin:", admin.email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to cookies
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });

    // Return only necessary admin details
    res.status(200).json({
      message: "Login successful",
      admin: { name: admin.name, email: admin.email }, // Admin details if needed
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * @desc Get all admins
 * @route GET /api/admin
 * @access Private
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select("name email"); // Exclude password
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({
      message: "Failed to retrieve admins",
      error: error.message,
    });
  }
};

/**
 * @desc Fetch admin dashboard statistics
 * @route GET /api/admin/statistics
 * @access Private (Admin only)
 */
const getStatistics = async (req, res) => {
  try {
    // Fetch counts for each collection
    const [
      inquiriesCount,
      feedbackCount,
      solutionsCount,
      eventsCount,
      photosCount,
      adminsCount,
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Feedback.countDocuments(),
      Solution.countDocuments(),
      Event.countDocuments(),
      Photo.countDocuments(),
      Admin.countDocuments(),
    ]);

    res.status(200).json({
      inquiries: inquiriesCount,
      feedback: feedbackCount,
      solutions: solutionsCount,
      events: eventsCount,
      photos: photosCount,
      admins: adminsCount,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};

/**
 * @desc Create a new admin
 * @route POST /api/admin
 * @access Private
 */
const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

/**
 * @desc Change password for the logged-in admin
 * @route PUT /api/admin/password
 * @access Private
 */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};

/**
 * @desc Delete admin
 * @route DELETE /api/admin/:id
 * @access Private
 */
const deleteAdmin = async (req, res) => {
  const adminId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: "Invalid Admin ID" });
  }
  try {
    const adminId = req.params.id;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Admin deleted successfully", admin: deletedAdmin });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Failed to delete admin" });
  }
};

module.exports = {
  loginAdmin,
  getAllAdmins,
  getStatistics,
  createAdmin,
  changePassword,
  deleteAdmin,
};
