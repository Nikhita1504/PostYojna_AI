const express = require("express");
const { SchemeModel } = require("../model/db");
const AddSchemeRouter = express.Router();


AddSchemeRouter.post('/schemes', async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate request body
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }

    // Create and save the new scheme
    const newScheme = new SchemeModel({ name, description });
    await newScheme.save();

    res.status(201).json({ success:true,message: 'Scheme added successfully!', scheme: newScheme });
  } catch (error) {
    console.error('Error saving scheme:', error);
    res.status(500).json({success:false, message: 'Server error. Please try again later.' });
  }
});

module.exports = AddSchemeRouter;

