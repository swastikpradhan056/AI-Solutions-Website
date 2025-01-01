const express = require("express");
const {
  addUpcomingEvent,
  getUpcomingEvents,
  getUpcomingEventById,
  editUpcomingEvent,
  deleteUpcomingEvent,
} = require("../controllers/upcomingEventController");
const { authMiddleware, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public route to get all upcoming events
router.get("/", getUpcomingEvents);

// Public route to get a specific upcoming event by ID
router.get("/:id", getUpcomingEventById);

// Admin route to add a new upcoming event
router.post(
  "/",
  authMiddleware,
  admin,
  upload.single("image"),
  addUpcomingEvent
);

// Admin route to edit an existing upcoming event
router.put("/:id", authMiddleware, upload.single("image"), editUpcomingEvent);

// Admin route to delete an upcoming event
router.delete("/:id", deleteUpcomingEvent);

module.exports = router;
