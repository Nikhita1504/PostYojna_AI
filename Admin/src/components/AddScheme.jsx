import React from "react";
import { useState } from "react";
import { handleError, handleSucess } from "../utils";
import axios from "axios";
import { ToastContainer } from "react-toastify";
const AddScheme = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Scheme:", formData);
    try {
      const response = await axios.post(
        "http://localhost:3000/Addscheme/schemes",
         formData 
      );
      console.log(response.data)
      if (response.data.success) {
        handleSucess(response.data.message);
      } else {
        handleError(response.data.message);
      }
    } catch (error) {
      handleError(error);
      console.log(error);
    }
  };
  return (
    <div>
      <h2>Add New Scheme</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Scheme Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
        <button type="submit">Add Scheme</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddScheme;
