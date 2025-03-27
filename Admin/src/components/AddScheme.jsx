import React, { useState } from "react";
import { handleError, handleSucess } from "../utils";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddScheme = () => {
  const [formData, setFormData] = useState({
    scheme_name: "",
    description: "",
    scheme_type: "",
    target_gender: "",
    target_age_group: {
      young: "",
      youth: "",
      adult: "",
      senior_citizen: "",
    },
    min_investment: "",
    max_investment: "",
    roi: "",
    risk_level: "",
    target_occupation: "",
    target_income_level: "",
    target_education_level: "",
    tax_benefit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("age_")) {
      const key = name.split("_")[1];
      setFormData((prevState) => ({
        ...prevState,
        target_age_group: {
          ...prevState.target_age_group,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.scheme_name.trim()) errors.push("Scheme name is required.");
    if (!formData.description.trim()) errors.push("Description is required.");
    if (!formData.scheme_type.trim()) errors.push("Scheme type is required.");
    if (!formData.target_gender) errors.push("Target gender is required.");
    if (!formData.risk_level) errors.push("Risk level is required.");
    if (!formData.tax_benefit) errors.push("Tax benefit selection is required.");

    Object.values(formData.target_age_group).forEach((age, idx) => {
      if (!age) {
        errors.push(
          `Age group ${
            ["young", "youth", "adult", "senior citizen"][idx]
          } is required.`
        );
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length) {
      handleError(errors.join(" "));
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/Addscheme/schemes",
        formData
      );
      if (response.data.success) {
        handleSucess(response.data.message);
        setFormData({
          scheme_name: "",
          description: "",
          scheme_type: "",
          target_gender: "",
          target_age_group: {
            young: "",
            youth: "",
            adult: "",
            senior_citizen: "",
          },
          min_investment: "",
          max_investment: "",
          roi: "",
          risk_level: "",
          target_occupation: "",
          target_income_level: "",
          target_education_level: "",
          tax_benefit: "",
        });
      } else {
        handleError(response.data.message);
      }
    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Add New Scheme</h2>
      <form onSubmit={handleSubmit}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Scheme Name:</label>
          <input
            type="text"
            name="scheme_name"
            value={formData.scheme_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Scheme Type:</label>
          <input
            type="text"
            name="scheme_type"
            value={formData.scheme_type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Gender:</label>
          <select
            name="target_gender"
            value={formData.target_gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="All">All</option>
          </select>
        </div>
        <div>
          <label>Target Age Group:</label>
          <div>
            <label>Young:</label>
            <input
              type="number"
              name="age_young"
              value={formData.target_age_group.young}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Youth:</label>
            <input
              type="number"
              name="age_youth"
              value={formData.target_age_group.youth}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Adult:</label>
            <input
              type="number"
              name="age_adult"
              value={formData.target_age_group.adult}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Senior Citizen:</label>
            <input
              type="number"
              name="age_senior_citizen"
              value={formData.target_age_group.senior_citizen}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>
        </div>
        <div>
          <label>Minimum Investment:</label>
          <input
            type="number"
            name="min_investment"
            value={formData.min_investment}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Maximum Investment:</label>
          <input
            type="number"
            name="max_investment"
            value={formData.max_investment}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rate of Interest:</label>
          <input
            type="number"
            step="0.01"
            name="roi"
            value={formData.roi}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Risk Level:</label>
          <select
            name="risk_level"
            value={formData.risk_level}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label>Target Occupation:</label>
          <input
            type="text"
            name="target_occupation"
            value={formData.target_occupation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Income Level:</label>
          <input
            type="number"
            name="target_income_level"
            value={formData.target_income_level}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Education Level:</label>
          <input
            type="number"
            name="target_education_level"
            value={formData.target_education_level}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tax Benefit:</label>
          <select
            name="tax_benefit"
            value={formData.tax_benefit}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <button type="submit">Add Scheme</button>
      </form>        <button type="submit">Add Scheme</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddScheme;
