const express = require("express");
const {
  addSoftwareSolution,
  getSoftwareSolutions,
  editSoftwareSolution,
  deleteSoftwareSolution,
  getSoftwareSolutionById,
} = require("../controllers/softwareSolutionController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public route to get all software solutions
router.get("/", getSoftwareSolutions);

// Route to get details of a solution by ID
router.get("/:id", getSoftwareSolutionById);

// Admin route to add a new software solution
router.post("/", upload.single("image"), addSoftwareSolution);

// Admin route to edit a software solution
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  editSoftwareSolution
);

// Admin route to delete a software solution
router.delete("/:id", authMiddleware, deleteSoftwareSolution);

module.exports = router;
