const express = require("express");
const {
  loginAdmin,
  getAdminProfile,
  getStatistics,
  getAllAdmins,
  createAdmin,
  changePassword,
  deleteAdmin,
} = require("../controllers/adminController");
const { authMiddleware, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @desc Route for admin login
 * @route POST /api/admin/login
 * @access Public
 */
router.post("/login", loginAdmin);

/**
 * @desc Route to get the authenticated admin's page
 * @route GET /api/admin/
 * @access Private (Authenticated users only)
 */
router.get("/", getAllAdmins);

/**
 * @desc Create a new admin
 * @route POST /api/admin
 * @access Private
 */
router.post("/", authMiddleware, createAdmin);

/**
 * @desc Change password for the logged-in admin
 * @route PUT /api/admin/password
 * @access Private
 */
router.put("/password", authMiddleware, changePassword);

/**
 * @desc Delete admin
 * @route DELETE /api/admin/:id
 * @access Private
 */
router.delete("/:id", deleteAdmin);

/**
 * @desc Route to fetch admin dashboard statistics
 * @route GET /api/admin/statistics
 * @access Private (Admin only)
 */
router.get("/statistics", authMiddleware, getStatistics);

module.exports = router;
