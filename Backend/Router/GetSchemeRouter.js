const express = require("express");
const { SchemeModel } = require("../model/db");
const GetSchemeRouter = express.Router();

GetSchemeRouter.get("/", async (req, res) => {
  try {
    // Fetch all schemes from the database
    const schemes = await SchemeModel.find({});

    // Return the schemes as a response
    res.status(200).json({
        success: true,
        data: schemes
    });
} catch (error) {
    // Handle any errors during database operations
    console.error("Error fetching schemes:", error);
    res.status(500).json({
        success: false,
        message: "Failed to fetch schemes",
        error: error.message
    });
}
});

module.exports = GetSchemeRouter;
