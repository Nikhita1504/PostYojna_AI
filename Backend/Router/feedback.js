const express = require("express");
const {FeedbackModel }= require("../model/db");
const feedbackRouter = express.Router();
require("dotenv").config();

feedbackRouter.get("/scheme/:scheme" , async(req,res) =>{
  
  const { scheme } = req.params;  // Extract scheme from the URL parameter
  console.log(scheme);

  try {
    // Find all feedback documents that match the provided scheme
    const feedbacks = await FeedbackModel.find({ scheme });

    // If feedbacks are found, return them as JSON
    if (feedbacks.length > 0) {
      // console.log(feedbacks);
      res.json(feedbacks);
      
    } else {
      res.status(404).json({ message: "No feedback found for this scheme" });
    }
  } catch (error) {
    // Handle any errors (e.g., database errors)
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = feedbackRouter;