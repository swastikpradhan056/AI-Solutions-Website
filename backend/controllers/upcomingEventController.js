const UpcomingEvent = require("../models/UpcomingEvent");
const multer = require("multer");
const path = require("path");

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    ); // Unique filename with timestamp
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for file size
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
}).single("image"); // 'image' field name in the form

// @desc Add a new upcoming event
const addUpcomingEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  if (!title || !description || !date || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const imagePath = `/uploads/${req.file.filename}`; // Path to the uploaded image

  try {
    const newEvent = await UpcomingEvent.create({
      title,
      description,
      date,
      location,
      image: imagePath, // Store image path if uploaded
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error adding upcoming event:", error);
    res.status(500).json({ message: "Error adding upcoming event", error });
  }
};

// @desc Get all upcoming events
// @route GET /api/upcoming-events
// @access Public
const getUpcomingEvents = async (req, res) => {
  try {
    const events = await UpcomingEvent.find().sort({ date: 1 }); // Sorted by date
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// @desc Get upcoming event by ID
// @route GET /api/upcoming-events/:id
// @access Public
const getUpcomingEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await UpcomingEvent.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// @desc Edit an upcoming event
const editUpcomingEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;

  if (!title || !description || !date || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const event = await UpcomingEvent.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update event fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    // Handle file upload if present
    if (req.file) {
      event.image = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error editing event:", error);
    res.status(500).json({ message: "Error editing event", error });
  }
};

// @desc Delete an upcoming event
// @route DELETE /api/upcoming-events/:id
// @access Private
const deleteUpcomingEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await UpcomingEvent.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event", error });
  }
};

module.exports = {
  upload,
  addUpcomingEvent,
  getUpcomingEvents,
  getUpcomingEventById,
  editUpcomingEvent,
  deleteUpcomingEvent,
};
