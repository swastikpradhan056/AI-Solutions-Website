const { default: mongoose } = require("mongoose");
const Inquiry = require("../models/Inquiry");
const nodemailer = require("nodemailer");

// @desc Add a new inquiry and send email notification
// @route POST /api/inquiries
// @access Public
const addInquiry = async (req, res) => {
  const { name, email, phone, company, country, jobTitle, jobDetails } =
    req.body;

  try {
    // Save the inquiry to the database
    const newInquiry = new Inquiry({
      name,
      email,
      phone,
      company,
      country,
      jobTitle,
      jobDetails,
    });

    const savedInquiry = await newInquiry.save();

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
      to: process.env.COMPANY_EMAIL, // Replace with the admin's email
      subject: "New Inquiry Submitted",
      text: `A new inquiry has been submitted:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Company: ${company}
      Country: ${country}
      Job Title: ${jobTitle}
      Job Details: ${jobDetails}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json(savedInquiry);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save inquiry or send email",
      error: error.message,
    });
  }
};

// @desc Get all inquiries
// @route GET /api/inquiries
// @access Private (Admin)
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve inquiries", error: error.message });
  }
};

/**
 * @desc Delete inquiries
 * @route DELETE /api/inquiries/:id
 * @access Public
 */
const deleteInquiry = async (req, res) => {
  const inquiryId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(inquiryId)) {
    return res.status(400).json({ message: "Invalid Inquiry ID" });
  }
  try {
    const inquiryId = req.params.id;
    const deletedInquiry = await Inquiry.findByIdAndDelete(inquiryId);

    if (!deletedInquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    res.status(200).json({
      message: "Inquiry deleted successfully",
      inquiry: deletedInquiry,
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ message: "Failed to delete inquiry" });
  }
};

module.exports = { addInquiry, getInquiries, deleteInquiry };
