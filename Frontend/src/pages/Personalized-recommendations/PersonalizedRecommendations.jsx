import React, { useState } from "react";
import styles from "./PersonalizedRecommendations.module.css";
import data from "./data/data2.json"; 
import { useNavigate } from "react-router-dom";

const PersonalizedRecommendations = () => {
  const [formType, setFormType] = useState("forYou"); // State to manage which form to show
  const [riskLevel, setRiskLevel] = useState(50); // State to manage risk level slider
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    maritalStatus: "",
    occupation: "",
    state: "",
    district: "",
    areaType: "", // Add the areaType field here
  });
  const navigate = useNavigate();

  // Get unique states
  const uniqueStates = [...new Set(data.map((item) => item.State_name))];

  // Handle state change
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    // Filter the districts based on the selected state
    const filteredDistricts = data
      .filter((item) => item.State_name === e.target.value)
      .map((item) => item.District_name);
    setDistricts(filteredDistricts);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Pass the form data to the recommendations page
    navigate("/Home/Personalized-recommendations/results", { state: { formData, riskLevel } });
  };

  return (
    <div className={styles.bigCon}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <img src="/assets/fullbanner.png" alt="Header Banner" />
        </div>

        {/* Form Container */}
        <div className={styles.formContainer}>
          <h4>Fill Details</h4>
          {/* Form Rendering */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formContent}>
              {/* Left Section */}
              <div className={styles.leftSection}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Gender</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Marital Status</label>
                  <select
                    name="maritalStatus"
                    required
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Occupation</label>
                  <select
                    name="occupation"
                    required
                    value={formData.occupation}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Occupation</option>
                    <option value="service">Service</option>
                    <option value="business">Business</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="unemployed">unemployed</option>
                  </select>
                </div>
              </div>

              {/* Right Section */}
              <div className={styles.rightSection}>
                <div className={styles.formGroup}>
                  <label>State</label>
                  <select
                    name="state"
                    value={selectedState}
                    onChange={handleStateChange}
                    required
                  >
                    <option value="">Select State</option>
                    {uniqueStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>District</label>
                  <select
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Area Type</label>
                  <select
                    name="areaType"
                    value={formData.areaType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select area type
                    </option>
                    <option value="rural">Rural</option>
                    <option value="urban">Urban</option>
                  </select>
                </div>
                {/* <div className={styles.formGroup}>
                  <label>Risk Level: {riskLevel}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                  />
                </div> */}
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
