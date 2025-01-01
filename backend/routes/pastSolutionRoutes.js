const express = require("express");
const {
  addPastSolution,
  getPastSolutions,
} = require("../controllers/pastSolutionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route to get all past solutions
router.get("/", getPastSolutions);

// Admin route to add a new past solution
router.post("/", authMiddleware, addPastSolution);

module.exports = router;
