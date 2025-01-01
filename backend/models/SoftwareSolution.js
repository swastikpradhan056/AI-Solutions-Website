const mongoose = require("mongoose");

const softwareSolutionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    benefits: { type: [String], required: true },
    tags: { type: [String], default: [] },
    image: { type: String, required: true }, // Image field
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoftwareSolution", softwareSolutionSchema);
