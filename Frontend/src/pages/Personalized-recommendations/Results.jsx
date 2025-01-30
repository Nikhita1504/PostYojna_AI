import React, { useState } from "react";
import styles from "./Results.module.css"; // Assume CSS for the layout is in this file

const Results = () => {
  // Dummy data for the schemes
  const schemes = [
    {
      abbreviation: "SB",
      fullName: "Post Office Savings Account",
      interestRate: "4.0%",
      minInvestment: "₹500",
      successScore: 85,
    },
    {
      abbreviation: "RD",
      fullName: "National Savings Recurring Deposit Account",
      interestRate: "5.8%",
      minInvestment: "₹100",
      successScore: 75,
    },
    {
      abbreviation: "TD",
      fullName: "National Savings Time Deposit Account",
      interestRate: "6.9%",
      minInvestment: "₹1000",
      successScore: 65,
    },
    {
      abbreviation: "MIS",
      fullName: "National Savings Monthly Income Account",
      interestRate: "6.7%",
      minInvestment: "₹1000",
      successScore: 24,
    },
    {
      abbreviation: "SCSS",
      fullName: "Senior Citizens Savings Scheme Account",
      interestRate: "8.2%",
      minInvestment: "₹1000",
      successScore: 95,
    },
    {
      abbreviation: "PPF",
      fullName: "Public Provident Fund Account",
      interestRate: "7.1%",
      minInvestment: "₹500",
      successScore: 90,
    },
    {
      abbreviation: "SSA",
      fullName: "Sukanya Samriddhi Account",
      interestRate: "8.0%",
      minInvestment: "₹250",
      successScore: 18,
    },
    {
      abbreviation: "NSC",
      fullName: "National Savings Certificates",
      interestRate: "7.0%",
      minInvestment: "₹1000",
      successScore: 70,
    },
    {
      abbreviation: "KVP",
      fullName: "Kisan Vikas Patra",
      interestRate: "7.0%",
      minInvestment: "₹1000",
      successScore: 60,
    },
    {
      abbreviation: "RLI",
      fullName: "Rural Life Insurance",
      interestRate: "7.0%",
      minInvestment: "₹1000",
      successScore: 60,
    },
    {
      abbreviation: "PLI",
      fullName: "Postal Life Insurance",
      interestRate: "7.0%",
      minInvestment: "₹1000",
      successScore: 60,
    },
  ];

  // State for selected risk level
  const [selectedRisk, setSelectedRisk] = useState("All");

  // Function to calculate risk level
  const getRiskLevel = (score) => {
    if (score <= 30) return "High";
    if (score <= 70) return "Medium";
    return "Low";
  };

  // Filter schemes based on selected risk level
  const filteredSchemes =
    selectedRisk === "All"
      ? schemes
      : schemes.filter((scheme) => getRiskLevel(scheme.successScore) === selectedRisk);

  return (
    <div className={styles.resultsContainer}>
      <header className={styles.header}>
        <h1>Post Office Investment Schemes Performance Dashboard</h1>
        <p>Last updated: February 15, 2024</p>
        <div className={styles.filters}>
          <select onChange={(e) => setSelectedRisk(e.target.value)} value={selectedRisk}>
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>
      </header>

      <main className={styles.content}>
        {/* Progress Bars */}
        <section className={styles.progressSection}>
          {filteredSchemes.map((scheme, index) => (
            <div key={index} className={styles.progressItem}>
              <span className={styles.schemeAbbr}>{scheme.abbreviation}</span>
              <div className={styles.progressBarContainer}>
                <div
                  className={`${styles.progressBar} ${
                    scheme.successScore > 70
                      ? styles.lowRisk
                      : scheme.successScore > 30
                      ? styles.mediumRisk
                      : styles.highRisk
                  }`}
                  style={{
                    width: `${scheme.successScore}%`,
                  }}
                ></div>
              </div>
              <span className={styles.successScore}>{scheme.successScore}%</span>
            </div>
          ))}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div style={{ backgroundColor: "#34c759" }}></div> Low Risk (71-100%)
            </div>
            <div className={styles.legendItem}>
              <div style={{ backgroundColor: "#ffcc00" }}></div> Medium Risk (31-70%)
            </div>
            <div className={styles.legendItem}>
              <div style={{ backgroundColor: "#ff3b30" }}></div> High Risk (0-30%)
            </div>
          </div>
        </section>

        <section className={styles.detailsSection}>
          <h2>Scheme Details</h2>
          <div className={styles.tableHeader}>
            <span>Scheme</span>
            <span>Full Name</span>
            <span>Interest Rate</span>
            <span>Min. Investment</span>
          </div>
          {filteredSchemes.map((scheme, index) => (
            <div key={index} className={styles.tableRow}>
              <span>{scheme.abbreviation}</span>
              <span>{scheme.fullName}</span>
              <span>{scheme.interestRate}</span>
              <span>{scheme.minInvestment}</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Results;
