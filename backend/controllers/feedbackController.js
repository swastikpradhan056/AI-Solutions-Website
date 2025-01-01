const { default: mongoose } = require("mongoose");
const Feedback = require("../models/Feedback");
const nodemailer = require("nodemailer");

// @desc Add new customer feedback
// @route POST /api/feedback
// @access Public
const addFeedback = async (req, res) => {
  const { name, rating, comment } = req.body;

  try {
    const newFeedback = await Feedback.create({ name, rating, comment });

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });
    // Email notification details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "swastikpradhan056@gmail.com", // Replace with the admin's email
      subject: "New Feedback Submitted",
      text: `A new feedback has been submitted:
      
      Name: ${name}
      Rating: ${rating}
      Comment: ${comment}
      `,
    };
    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(400).json({ message: "Error adding feedback", error });
  }
};

// @desc Get all customer feedback
// @route GET /api/feedback
// @access Public
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};

// @desc Update customer feedback
// @route PUT /api/feedback/:id
// @access Public
const updateFeedback = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Update fields if provided
    if (rating) feedback.rating = rating;
    if (comment) feedback.comment = comment;

    const updatedFeedback = await feedback.save();
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: "Error updating feedback", error });
  }
};

/**
 * @desc Delete feedback
 * @route DELETE /api/feedback/:id
 * @access Private
 */
const deleteFeedback = async (req, res) => {
  const feedbackId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    return res.status(400).json({ message: "Invalid Feedback ID" });
  }
  try {
    const feedbackId = req.params.id;
    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({
      message: "Feedback deleted successfully",
      feedback: deletedFeedback,
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Failed to delete feedback" });
  }
};

module.exports = { addFeedback, getFeedback, updateFeedback, deleteFeedback };
