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


ActiveSchemeRouter.post("/Apply", async (req, res) => {
  const { schemeName, location } = req.body; // Extracting data from the request body
  console.log(schemeName, location);

  try {
    // Find the active scheme by schemeName and state
    var activeScheme = await ActiveSchemeModel.findOne({
      schemeName: schemeName,
      state: location.state, // Match the state field
    });

    if (!activeScheme) {
      // Create a new document if no active scheme is found
      activeScheme = new ActiveSchemeModel({
        schemeName: schemeName,
        state: location.state,
        districts: [
          {
            districtName: location.district,
            isActive: true, // Default value
          },
        ],
      });

      // Save the new document
      await activeScheme.save();

      return res.status(201).json({
        success: true,
        message: "New scheme created with the specified state and district.",
        data: activeScheme,
      });
    }
    // Check if the district already exists in the array
    const districtExists = activeScheme.districts.some(
      (district) => district.districtName === location.district
    );

    if (districtExists) {
      return res.status(400).json({
        success: false,
        message: "District already exists in the scheme.",
      });
    }

    // Add the new district to the districts array
    activeScheme.districts.push({
      districtName: location.district,
      isActive: true, // Default value
    });

    // Save the updated document
    await activeScheme.save();

    return res.status(200).json({
      success: true,
      message: "District added successfully to the scheme.",
      data: activeScheme,
    });
  } catch (error) {
    console.error("Error adding district:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the district.",
    });
  }
});



module.exports = ActiveSchemeRouter;
