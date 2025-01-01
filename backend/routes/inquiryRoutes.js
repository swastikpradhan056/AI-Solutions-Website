const express = require("express");
const {
  addInquiry,
  getInquiries,
  deleteInquiry,
} = require("../controllers/inquiryController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to add a new inquiry
router.post("/", addInquiry);

// Route to get all inquiries
router.get("/", authMiddleware, getInquiries);

// Route to delete inquiry
router.delete("/:id", deleteInquiry);

module.exports = router;
