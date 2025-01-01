const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const About = require("../models/About");

const router = express.Router();

// @desc Get About page content
// @route GET /api/about
// @access Public (remove authMiddleware if this should be public)
router.get("/", async (req, res) => {
  try {
    // Fetch about content from the database
    const aboutContent = await About.findOne();

    // Check if content exists
    if (!aboutContent) {
      return res.status(404).json({ message: "About content not found" });
    }

    // Send success response
    res.status(200).json(aboutContent);
  } catch (error) {
    // Send error response with details
    console.error("Error fetching About content:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching About content", error: error.message });
  }
});

// @desc Update About page content
// @route PUT /api/about
// @access Private (Admin)
router.put("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    let aboutContent = await About.findOne();
    if (!aboutContent) {
      aboutContent = new About({ title, content });
    } else {
      aboutContent.title = title;
      aboutContent.content = content;
    }
    await aboutContent.save();
    res.status(200).json(aboutContent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating About content", error: error.message });
  }
});

module.exports = router;
