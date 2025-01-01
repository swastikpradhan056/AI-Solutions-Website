const express = require("express");
const {
  addFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

// Public route to get all feedback
router.get("/", getFeedback);

// Public route to submit feedback
router.post("/", addFeedback);

// Public route to update feedback
router.put("/:id", updateFeedback);

// Public route to delete feedback
router.delete("/:id", deleteFeedback);

module.exports = router;
