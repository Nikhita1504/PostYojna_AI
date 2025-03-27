const express = require("express");
const { SchemeModel } = require("../model/db");
const AddSchemeRouter = express.Router();

AddSchemeRouter.post('/schemes', async (req, res) => {
  try {
    const {
      scheme_name,
      description,
      scheme_type,
      target_gender,
      target_age_group,
      min_investment,
      max_investment,
      roi,
      risk_level,
      target_occupation,
      target_income_level,
      target_education_level,
      tax_benefit,
    } = req.body;

    // Validate required fields
    if (
      !scheme_name ||
      !description ||
      !scheme_type ||
      !target_gender ||
      !target_age_group ||
      !min_investment ||
      !max_investment ||
      !roi ||
      !risk_level ||
      !target_occupation ||
      !target_income_level ||
      !target_education_level ||
      !tax_benefit
    ) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create and save the new scheme
    const newScheme = new SchemeModel({
      scheme_name,
      description,
      scheme_type,
      target_gender,
      target_age_group,
      min_investment,
      max_investment,
      roi,
      risk_level,
      target_occupation,
      target_income_level,
      target_education_level,
      tax_benefit,
    });

    await newScheme.save();

    res.status(201).json({ success: true, message: 'Scheme added successfully!', scheme: newScheme });
  } catch (error) {
    console.error('Error saving scheme:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});


module.exports = AddSchemeRouter;

