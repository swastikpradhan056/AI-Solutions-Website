const SoftwareSolution = require("../models/SoftwareSolution");

// @desc Add a new software solution
// @route POST /api/software-solutions
// @access Private
const addSoftwareSolution = async (req, res) => {
  const { title, description, benefits, tags } = req.body;

  if (!title || !description || !benefits || !tags) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const imagePath = `/uploads/${req.file.filename}`; // Path to the uploaded image

  try {
    const newSolution = await SoftwareSolution.create({
      title,
      description,
      benefits: benefits.split(",").map((b) => b.trim()), // Convert to array
      tags: tags.split(",").map((t) => t.trim()), // Convert to array
      image: imagePath,
    });
    res.status(201).json(newSolution);
  } catch (error) {
    console.error("Error adding software solution:", error);
    res.status(400).json({ message: "Error adding software solution", error });
  }
};

// @desc Get all software solutions
// @route GET /api/software-solutions
// @access Public
const getSoftwareSolutions = async (req, res) => {
  try {
    const solutions = await SoftwareSolution.find();
    res.status(200).json(solutions);
  } catch (error) {
    console.error("Error fetching software solutions:", error);
    res
      .status(500)
      .json({ message: "Error fetching software solutions", error });
  }
};

// @desc Get details of a software solution by ID
// @route GET /api/software-solutions/:id
// @access Public (or Private, depending on your requirements)
const getSoftwareSolutionById = async (req, res) => {
  const { id } = req.params; // Get the solution ID from the URL

  try {
    // Find the solution by ID in the database
    const solution = await SoftwareSolution.findById(id);

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    // Send the solution details as the response
    res.status(200).json(solution);
  } catch (error) {
    console.error("Error fetching solution details:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// @desc Edit a software solution
// @route PUT /api/software-solutions/:id
// @access Private
const editSoftwareSolution = async (req, res) => {
  const { id } = req.params;
  const { title, description, benefits, tags } = req.body;

  try {
    // Logging request data
    console.log("Received request to update solution with ID:", id);
    console.log("Request body:", req.body);

    // Find the solution by ID
    const solution = await SoftwareSolution.findById(id);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    // Update solution
    solution.title = title || solution.title;
    solution.description = description || solution.description;
    solution.benefits = benefits
      ? benefits.split(",").map((b) => b.trim())
      : solution.benefits;
    solution.tags = tags ? tags.split(",").map((t) => t.trim()) : solution.tags;

    // Handle file upload if present
    if (req.file) {
      console.log("Uploading new image:", req.file.filename);
      solution.image = `/uploads/${req.file.filename}`;
    }

    // Save the updated solution
    const updatedSolution = await solution.save();

    console.log("Solution updated successfully:", updatedSolution);
    res.status(200).json(updatedSolution);
  } catch (error) {
    console.error("Error editing solution:", error);
    res.status(500).json({ message: "Error editing solution", error });
  }
};

// @desc Delete a software solution
// @route DELETE /api/software-solutions/:id
// @access Private
const deleteSoftwareSolution = async (req, res) => {
  const { id } = req.params; // Extract the ID from the URL
  try {
    const solution = await SoftwareSolution.findByIdAndDelete(id);

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    res.status(200).json({ message: "Solution deleted successfully" });
  } catch (error) {
    console.error("Error deleting solution:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  addSoftwareSolution,
  getSoftwareSolutions,
  getSoftwareSolutionById,
  editSoftwareSolution,
  deleteSoftwareSolution,
};
