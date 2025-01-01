const mongoose = require("mongoose");

const pastSolutionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    impactMetrics: {
      type: String, // Description of the solution's impact, e.g., "Reduced downtime by 25%"
      required: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("PastSolution", pastSolutionSchema);
