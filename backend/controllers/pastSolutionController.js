const PastSolution = require("../models/PastSolution");

// @desc Add a new past solution
// @route POST /api/past-solutions
// @access Private
const addPastSolution = async (req, res) => {
  const { title, description, industry, impactMetrics } = req.body;

  try {
    const newPastSolution = await PastSolution.create({
      title,
      description,
      industry,
      impactMetrics,
    });
    res.status(201).json(newPastSolution);
  } catch (error) {
    res.status(400).json({ message: "Error adding past solution", error });
  }
};

// @desc Get all past solutions
// @route GET /api/past-solutions
// @access Public
const getPastSolutions = async (req, res) => {
  try {
    const solutions = await PastSolution.find();
    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching past solutions", error });
  }
};

module.exports = { addPastSolution, getPastSolutions };
