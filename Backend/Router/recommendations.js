const express = require("express");
const axios = require("axios");
const { Location } = require("../model/db");
const recommendations= express.Router();

recommendations.get("/searchdata", async (req, res) => {
    
  
    try {
        const { location } = req.query;
      // Find the document by location
      const locationData = await Location.findOne({ location });
  
      if (!locationData) {
        return res.status(404).json({ message: "Location not found." });
      }
  
      // Return the data
      res.status(200).json(locationData);
    } catch (error) {
      console.error("Error fetching location data:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  
  module.exports=recommendations;