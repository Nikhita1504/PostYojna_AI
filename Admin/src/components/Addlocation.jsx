import React from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSucess } from "../utils";
import axios from "axios";
const Addlocation = () => {
  const [formData, setFormData] = useState({
    region_name: "",
    population_density: "",
    Male: "",
    Female: "",
    gender_ratio: "",
    education_level: "",
    income_level: "",
    age_distribution: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Adjusting to match the backend schema, ensuring numbers are sent properly
      const requestData = {
        ...formData,
        population_density: parseInt(formData.population_density, 10),
        Male: parseInt(formData.Male, 10),
        Female: parseInt(formData.Female, 10),
        gender_ratio: parseFloat(formData.gender_ratio),
        education_level: parseFloat(formData.education_level),
        income_level: parseInt(formData.income_level, 10),
      };
      console.log(requestData);

      const response = await axios.post(
        "http://localhost:3000/AddnewlocationData/regions",
        requestData
      );

      if (response.data.successfull) {
        handleSucess(response.data.message);
      } else {
        handleError(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Region Name:
        <input
          type="text"
          name="region_name"
          value={formData.region_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Population Density:
        <input
          type="number"
          name="population_density"
          value={formData.population_density}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Male Population:
        <input
          type="number"
          name="Male"
          value={formData.Male}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Female Population:
        <input
          type="number"
          name="Female"
          value={formData.Female}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Gender Ratio:
        <input
          type="number"
          step="0.000001"
          name="gender_ratio"
          value={formData.gender_ratio}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Education Level (%):
        <input
          type="number"
          step="0.01"
          name="education_level"
          value={formData.education_level}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Income Level:
        <input
          type="number"
          name="income_level"
          value={formData.income_level}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Age Distribution (e.g., "21%, 23%, 39%, 17%"):
        <input
          type="text"
          name="age_distribution"
          value={formData.age_distribution}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit" onSubmit={handleSubmit}>
        Submit
      </button>
      <ToastContainer />
    </form>
  );
};

export default Addlocation;
