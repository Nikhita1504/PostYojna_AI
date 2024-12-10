const express = require("express");
const { ActiveSchemeModel } = require("../model/db");
const ActiveSchemeRouter = express.Router();

ActiveSchemeRouter.get("/:schemeName", async (req, res) => {
  const { schemeName } = req.params;
console.log(schemeName);
try {
  // Find all active schemes that match the scheme name
  const activeSchemes = await ActiveSchemeModel.aggregate([
    { $match: { schemeName } }, // Match the scheme by name
    { $unwind: "$districts" }, // Unwind the districts array
    { $match: { "districts.isActive": true } }, // Filter only active districts
    {
      $group: {
        _id: "$state", // Group by state
        districts: { $push: "$districts.districtName" }, // Collect active districts
      },
    },
    { $project: { _id: 0, state: "$_id", districts: 1 } }, // Rename _id to state
  ]);

  // If no active schemes were found, return a message
  if (activeSchemes.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No active districts found for the given scheme.",
    });
  }

  // Return the result
  res.status(200).json({
    success: true,
    schemeName,
    data: activeSchemes,
  });
} catch (error) {
  console.error("Error fetching active schemes:", error);
  res.status(500).json({
    success: false,
    message: "An error occurred while fetching active schemes.",
  });
}
});


module.exports = ActiveSchemeRouter;
