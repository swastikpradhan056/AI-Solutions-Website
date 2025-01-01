const About = require("../models/About");

// @desc Get About page content
// @route GET /api/about
// @access Private (Admin)
const getAbout = async (req, res) => {
  try {
    const aboutContent = await About.findOne();
    if (!aboutContent) {
      return res.status(404).json({ message: "About content not found" });
    }
    res.status(200).json(aboutContent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching About content", error: error.message });
  }
};

// @desc Update About page content
// @route PUT /api/about
// @access Private (Admin)
const updateAbout = async (req, res) => {
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
};

module.exports = { getAbout, updateAbout };
