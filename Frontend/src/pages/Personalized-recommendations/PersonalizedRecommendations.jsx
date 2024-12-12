import React, { useState } from 'react';
import styles from "./PersonalizedRecommendations.module.css";

const PersonalizedRecommendations = () => {
  const [formType, setFormType] = useState('forYou'); // State to manage which form to show

  // Toggle handler
  const toggleForm = (type) => {
    setFormType(type);
  };

  // Common input fields for both forms
  const formFields = (
    <>
      <div className={styles.formGroup}>
        <label>Name</label>
        <input type="text" name="name" required />
      </div>
      <div className={styles.formGroup}>
        <label>Income</label>
        <input type="number" name="income" required />
      </div>
      <div className={styles.formGroup}>
        <label>Occupation</label>
        <select name="occupation" required>
          <option value="">Select Occupation</option>
          <option value="service">Service</option>
          <option value="business">Business</option>
          <option value="agriculture">Agriculture</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Age</label>
        <input type="number" name="age" required />
      </div>
      <div className={styles.formGroup}>
        <label>District</label>
        <input type="text" name="district" required />
      </div>
      <div className={styles.formGroup}>
        <label>State</label>
        <input type="text" name="state" required />
      </div>
    </>
  );

  return (
    <div className={styles.bigCon}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <img src="/assets/fullbanner.png" alt="Header Banner" />
        </div>

        {/* Form Container */}
        <div className={styles.formContainer}>
          {/* Toggle Buttons */}
          <div className={styles.toggleButton}>
            <button
              className={`${styles['toggle-option']} ${formType === 'forYou' ? styles.active : ''}`}
              onClick={() => toggleForm('forYou')}
            >
              For You
            </button>
            <button
              className={`${styles['toggle-option']} ${formType === 'forCustomer' ? styles.active : ''}`}
              onClick={() => toggleForm('forCustomer')}
            >
              For Customer
            </button>
          </div>

          {/* Form Rendering */}
          <form className={styles.form}>
            <h2>{formType === 'forYou' ? 'For You' : 'For Customer'} Form</h2>
            {formFields}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
