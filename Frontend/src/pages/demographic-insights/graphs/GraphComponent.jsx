import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LabelList,
  Cell,
  Pie,
  PieChart,
  Legend,
} from "recharts";
import styles from './GraphComponent.module.css';

const GraphComponent = () => {
  const location = useLocation();
  const { locationName } = location.state || {};

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [currlocation, setCurrlocation] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [visualizationMode, setVisualizationMode] = useState("primary");
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const categories = ['gender', 'Age Group', 'Income Level', 'Tax Benefit', 'Risk Level'];
  const options = {
    gender: ['Male', 'Female', 'Both'],
    'Age Group': ['young', 'adult', 'senior'],
    'Income Level': ['low', 'medium', 'high'],
    'Tax Benefit': ['yes', 'no'],
    'Risk Level': ['low', 'medium', 'high'],
  };

  const riskColors = {
    Low: "#4CAF50",
    Medium: "#FFC107",
    High: "#F44336",
  };

  const fetchingDistrict = async (locationName) => {
    const newPrompt = {
      address: locationName,
      myprompt: "You have been provided with a full address. Your task is to analyze the address and extract the district and state from it. Return only the following JSON object: { district: <district>, state: <state> }. Do not include any other data in the response. If the district or state cannot be determined, leave the corresponding field empty (e.g., district:  or state: )",
    };

    try {
      const response = await axios.post('http://localhost:3000/Gemini/get-district', { newPrompt });
      console.log(response.data);
      setCurrlocation(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (locationName) {
      fetchingDistrict(locationName);
    }
  }, [locationName]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedOption('');
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Static recommendations data
    const staticRecommendations = [
      {
        scheme: "Sukanya Samriddhi Yojana",
        score: 0.85,
        details: {
          ROI: 12.5,
          target_gender: "Female",
          risk_level: "Low",
          genre: "Savings",
        },
      },
      {
        scheme: "Post Office Saving Account",
        score: 0.75,
        details: {
          ROI: 10.1,
          target_gender: "Female",
          risk_level: "Low",
          genre: "General",
        },
      },
      {
        scheme: "Public Provident Fund",
        score: 0.70,
        details: {
          ROI: 7.1,
          target_gender: "Both",
          risk_level: "Low",
          genre: "Savings",
        },
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setRecommendations(staticRecommendations);
      setIsLoading(false);
    }, 4000);
  };


  const handleExplain = () => {
    let explanation = '';
    if (visualizationMode === "primary") {
      explanation = "• The bar chart shows the recommendation scores for the top 3 investment schemes.\n" +
                    "• The height of each bar represents the scheme's score, with higher bars indicating better recommendations.\n" +
                    "• The color of each bar indicates the risk level: Green for Low, Yellow for Medium, and Red for High risk.\n" +
                    "• The orange line represents the Return on Investment (ROI) for each scheme.\n" +
                    "• Click on a bar to see more details about that specific scheme.";
    } else if (visualizationMode === "comparison") {
      explanation = "• The pie chart compares the Return on Investment (ROI) for different investment schemes.\n" +
                    "• Each slice represents a scheme, with the size of the slice proportional to its ROI.\n" +
                    "• The color of each slice indicates the risk level: Green for Low, Yellow for Medium, and Red for High risk.\n" +
                    "• Hover over a slice to see the exact ROI percentage for that scheme.\n" +
                    "• This visualization helps in comparing the potential returns of different schemes at a glance.";
    }
    setExplanation(explanation);
  };

  const handleBarClick = (data) => {
    setSelectedScheme(data);
  };

  const renderPrimaryRecommendation = () => (
    <ResponsiveContainer width={800} height={400}>
      <BarChart
        data={recommendations.slice(0, 3)}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="scheme" fontSize={16} />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="score" fill="#8884d8" onClick={handleBarClick}>
          {recommendations.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={riskColors[entry.details.risk_level] || "#2196F3"} />
          ))}
          <LabelList dataKey="score" position="top" formatter={(value) => `${(value * 100).toFixed(1)}%`} />
        </Bar>
        <Line yAxisId="right" type="monotone" dataKey="details.ROI" stroke="#ff7300" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderSchemeComparison = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={recommendations}
          dataKey="details.ROI"
          nameKey="scheme"
          cx="50%"
          cy="50%"
          outerRadius={120}
          innerRadius={60}
          paddingAngle={5}
          label={(entry) => `${entry.scheme} (${entry.details.ROI}%)`}
        >
          {recommendations.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={riskColors[entry.details.risk_level] || "#2196F3"} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.bannerContainer}>
          <img src="/assets/fullbanner.png" alt="Full Banner" className={styles.fullBanner} />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles['dropdown-container']}>
            <select className={styles.select} onChange={handleCategoryChange} value={selectedCategory}>
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {selectedCategory && (
              <select className={styles.select} onChange={handleOptionChange} value={selectedOption}>
                <option value="">Select Option</option>
                {options[selectedCategory].map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {selectedOption && (
              <p>
                Selected {selectedCategory}: {selectedOption}
              </p>
            )}

            <button className={styles.submitButton} onClick={handleSubmit}>
              Submit
            </button>

            {currlocation && (
              <p>
                Fetched Location: <strong>{currlocation.district}</strong>, <strong>{currlocation.state}</strong>
              </p>
            )}
            <div className={styles.explainButtonContainer}>
              <button onClick={handleExplain}>Explain</button>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>Loading recommendations...</p>
            </div>
          ) : recommendations.length > 0 && (
            <>
              <div className={styles.toggleButtons}>
                <button
                  onClick={() => setVisualizationMode("primary")}
                  className={visualizationMode === "primary" ? styles.activeButton : ""}
                >
                  Based Recommendation Score
                </button>
                <button
                  onClick={() => setVisualizationMode("comparison")}
                  className={visualizationMode === "comparison" ? styles.activeButton : ""}
                >
                  ROI Comparison
                </button>
              </div>
              <div className={styles.chartContainer}>
                {visualizationMode === "primary" && renderPrimaryRecommendation()}
                {visualizationMode === "comparison" && renderSchemeComparison()}
              </div>
              {explanation && (
                <div className={styles.explanationContainer}>
                  <h3>Graph Explanation:</h3>
                  <pre>{explanation}</pre>
                </div>
              )}
              {selectedScheme && (
                <div className={styles.schemeDetails}>
                  <h3>{selectedScheme.scheme}</h3>
                  <p>Score: {(selectedScheme.score * 100).toFixed(1)}%</p>
                  <p>ROI: {selectedScheme.details.ROI}%</p>
                  <p>Risk Level: {selectedScheme.details.risk_level}</p>
                  <p>Target Gender: {selectedScheme.details.target_gender}</p>
                  <p>Genre: {selectedScheme.details.genre}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphComponent;

