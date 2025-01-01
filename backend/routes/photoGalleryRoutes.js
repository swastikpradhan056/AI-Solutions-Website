const express = require("express");
const {
  addPhoto,
  getPhotos,
  editPhoto,
  deletePhoto,
  getPhotoById,
} = require("../controllers/photoGalleryController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public route to get all photos
router.get("/", getPhotos);

// Route to get details of a photo by ID
router.get("/:id", getPhotoById);

// Admin route to add a new photo
router.post("/", authMiddleware, upload.single("image"), addPhoto);

// Admin route to edit a photo
router.put("/:id", authMiddleware, upload.single("image"), editPhoto);

// Admin route to delete a photo
router.delete("/:id", authMiddleware, deletePhoto);

module.exports = router;
