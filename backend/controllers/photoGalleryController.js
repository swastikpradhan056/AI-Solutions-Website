const PhotoGallery = require("../models/PhotoGallery");
const multer = require("multer");
const path = require("path");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set your uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Init multer
const upload = multer({ storage });

// @desc Add a new photo to the gallery
// @route POST /api/photos
// @access Private
const addPhoto = async (req, res) => {
  const { title, description, eventDate } = req.body;

  if (!title || !description || !eventDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const imagePath = `/uploads/${req.file.filename}`; // Path to the uploaded image

  try {
    const newPhoto = await PhotoGallery.create({
      title,
      description,
      imageUrl: imagePath,
      eventDate,
    });
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error("Error adding photo:", error);
    res.status(400).json({ message: "Error adding photo", error });
  }
};

// @desc Get all photos in the gallery
// @route GET /api/photos
// @access Public
const getPhotos = async (req, res) => {
  try {
    const photos = await PhotoGallery.find().sort({ eventDate: -1 });

    // Format eventDate to "yyyy-MM-dd"
    const formattedPhotos = photos.map((photo) => ({
      ...photo.toObject(),
      eventDate: photo.eventDate.toISOString().split("T")[0],
    }));

    res.status(200).json(formattedPhotos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve photos", error: error.message });
  }
};

// @desc Get details of a photo by ID
// @route GET /api/photos/:id
// @access Public
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await PhotoGallery.findById(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.status(200).json(photo);
  } catch (error) {
    console.error("Error fetching photo details:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// @desc Edit a photo
// @route PUT /api/photos/:id
// @access Private
const editPhoto = async (req, res) => {
  const { id } = req.params;
  const { title, description, eventDate } = req.body;

  try {
    const photo = await PhotoGallery.findById(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Update fields
    photo.title = title || photo.title;
    photo.description = description || photo.description;
    photo.eventDate = eventDate || photo.eventDate;

    // Handle file upload if present
    if (req.file) {
      photo.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedPhoto = await photo.save();
    res.status(200).json(updatedPhoto);
  } catch (error) {
    console.error("Error editing photo:", error);
    res.status(500).json({ message: "Error editing photo", error });
  }
};

// @desc Delete a photo
// @route DELETE /api/photos/:id
// @access Private
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await PhotoGallery.findByIdAndDelete(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  addPhoto,
  getPhotos,
  getPhotoById,
  editPhoto,
  deletePhoto,
  upload,
};
