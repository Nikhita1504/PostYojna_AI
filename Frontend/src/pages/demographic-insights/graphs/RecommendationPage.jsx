import React, { useEffect, useState } from 'react';
import styles from './Recommendations.module.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

// Sample data
const staticRecommendations = [
    {
      scheme: "Sukanya Samriddhi Yojana",
      score: 0.66,
      details: {
        ROI: 12.5,
        target_gender: "Female",
        risk_level: "Low",
        genre: "Savings",
        best_month: "January",
        best_duration: "1 - 10", // Best duration in January
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
        best_month: "April",
        best_duration: "16 - 30", // Best duration in April
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
        best_month: "March",
        best_duration: "1 - 10", // Best duration in March
      },
    },
    {
      scheme: "Post Office Recurring Deposit Account",
      score: 0.78,
      details: {
        ROI: 6.9,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
        best_month: "June",
        best_duration: "11 - 20", // Best duration in June
      },
    },
    {
      scheme: "Post Office Time Deposit Account",
      score: 0.80,
      details: {
        ROI: 7.5,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
        best_month: "September",
        best_duration: "1 - 15", // Best duration in September
      },
    },
    {
      scheme: "Post Office Monthly Income Scheme",
      score: 0.76,
      details: {
        ROI: 7.4,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Income",
        best_month: "December",
        best_duration: "16 - 31", // Best duration in December
      },
    },
    {
      scheme: "Senior Citizen Savings Scheme",
      score: 0.67,
      details: {
        ROI: 8.0,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
        best_month: "October",
        best_duration: "1 -  10", // Best duration in October
      },
    },
    {
      scheme: "Postal Life Insurance",
      score: 0.65,
      details: {
        ROI: 5.5,
        target_gender: "Both",
        risk_level: "Medium",
        genre: "Insurance",
        best_month: "November",
        best_duration: "11 - 20", // Best duration in November
      },
    },
    {
      scheme: "Rural Postal Life Insurance",
      score: 0.60,
      details: {
        ROI: 5.2,
        target_gender: "Both",
        risk_level: "Medium",
        genre: "Insurance",
        best_month: "May",
        best_duration: "1 - 15", // Best duration in May
      },
    },
    {
      scheme: "National Savings Certificate",
      score: 0.82,
      details: {
        ROI: 7.5,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
        best_month: "February",
        best_duration: "16 - 28", // Best duration in February
      },
    },
    {
      scheme: "Kisan Vikas Patra",
      score: 0.72,
      details: {
        ROI: 7.7,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
        best_month: "August",
        best_duration: "1 - 20", // Best duration in August
      },
    },
    {
      scheme: "Fixed Deposits",
      score: 0.91,
      details: {
        ROI: 6.8,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
        best_month: "January",
        best_duration: "16 - 31", // Best duration in January
      },
    },
    {
      scheme: "Recurring Deposits",
      score: 0.77,
      details: {
        ROI: 6.7,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
        best_month: "July",
        best_duration: "1 - 15", // Best duration in July
      },
    },
    {
      scheme: "Mahila Samman Savings Certificate",
      score: 0.88,
      details: {
        ROI: 7.6,
        target_gender: "Female",
        risk_level: "Low",
        genre: "Savings",
        best_month: "March",
        best_duration: "11 - 20", // Best duration in March
      },
    },
  ];
  

// Function to generate progress circle
const ProgressCircle = ({ score }) => {
    const radius = 40; // Increased radius for an even larger circle
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score * circumference); // Calculate progress

    const [count, setCount] = useState(0); // State to track the counting number
    

    useEffect(() => {
        let start = 0;
        const end = Math.round(score * 100); // Final value
        const duration = 1000; // Duration of the counting animation in ms
        const stepTime = duration / end; // Time per step

        const interval = setInterval(() => {
            if (start < end) {
                start++;
                setCount(start);
            } else {
                clearInterval(interval); // Stop once the count reaches the target
            }
        }, stepTime);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [score]);

    return (
        <svg width="120" height="120" style={{ display: 'block', margin: 'auto' }}>
            <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#eee"
                strokeWidth="8"
            />
            <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#FEA800" // Orange color for progress
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            <text
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
                fontSize="24" // Increased font size for better readability
                fill="#333"
            >
                {count}%
            </text>
        </svg>
    );
};



const RecommendationPage = () => {
    const location = useLocation();
    const { locationName } = location.state || {};
    console.log(locationName);
    const sortedRecommendations = staticRecommendations.sort((a, b) => b.score - a.score);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecommendation, setSelectedRecommendation] = useState(null);
    const [currlocation, setcurrlocation] = useState("");
    const [fetchDistrict, setFetchingDistrict] = useState(true);

    const handleViewDetails = (recommendation) => {
      setSelectedRecommendation(recommendation);
      setIsModalOpen(true);
    };
    const fetchingDistrict = async () => {
        const newPrompt = {
          address: locationName,
          myprompt:
            "You have been provided with a full address. Your task is to analyze the address and extract the district and state from it. Return only the following JSON object: { district: <district>, state: <state> }. Do not include any other data in the response. If the district or state cannot be determined, leave the corresponding field empty (e.g., district:  or state: )"
        };
    
        try {
          const response = await axios.post("http://localhost:3000/Gemini/get-district", { newPrompt })
    
          setFetchingDistrict(true);
          console.log(response.data)
          setcurrlocation(response.data)
        } catch (error) {
          console.log(error)
        } finally {
          setFetchingDistrict(false); // Stop loading for district
        }
      }
      console.log(currlocation.district);
    
      useEffect(() => {
        fetchingDistrict(locationName);
    
      }, []);

    
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedRecommendation(null);
    };
    const handleAddEvent = (recommendation) => {
        try {
            // Extract best month and duration
            const { best_month, best_duration } = recommendation.details;
    
            // Log the details for debugging
            console.log('Recommendation details:', recommendation.details);
    
            // Validate best_month and best_duration
            if (!best_month || typeof best_month !== 'string') {
                throw new Error('Invalid or missing best_month');
            }
    
            if (!best_duration || !/^\d{1,2} - \d{1,2}$/.test(best_duration)) {
                throw new Error(`Invalid or missing best_duration: ${best_duration}`);
            }
    
            // Parse the best_duration
            const [startDay, endDay] = best_duration.split(' - ').map(Number);
    
            if (isNaN(startDay) || isNaN(endDay) || startDay <= 0 || startDay > 31 || endDay <= 0 || endDay > 31) {
                throw new Error(`Invalid days in best_duration: ${best_duration}`);
            }
    
            const year = new Date().getFullYear();
            const monthIndex = new Date(`${best_month} 1, ${year}`).getMonth();
    
            if (isNaN(monthIndex)) {
                throw new Error(`Invalid month name: ${best_month}`);
            }
    
            // Set the start date using the startDay
            const startDate = new Date(year, monthIndex, startDay);
    
            // Set the end date to 3 days after the start date
            const endDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    
            const newEvent = {
                title: recommendation.scheme,
                description: `Recommended Scheme: ${recommendation.scheme}`,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            };
    
            console.log('New Event:', newEvent);
            console.log('best_duration:', best_duration);

    
            // Post to the backend
            axios
                .post('http://localhost:3000/events/add', newEvent)
                .then((response) => {
                    if (response.status === 201) {
                        // alert(`Event for "${recommendation.scheme}" added successfully!`);
                       toast.success(`Event for "${recommendation.scheme}" added successfully!`)
                    }
                })
                .catch((error) => console.error('Error adding event:', error));
        } catch (error) {
            console.error('Error in handleAddEvent:', error.message);
        }
    };

    const navigate=useNavigate();
    const handleNavigate=()=>{
        navigate("/Home/demographic-insights/maps/recommendations/graphs",{state:{locationName:currlocation.district}})
    }
    
    
    
    

    return (
        <div className={styles.bigCon}>
             <ToastContainer/>
            <div className={styles.innerCon}>
                <img src="/assets/fullbanner.png" alt="Banner" />
               <div className={styles.btnCon}>
                <h4>Scheme Recommendations for {currlocation.district}</h4>
               <div >
               <button onClick={handleNavigate}>Visualizations </button>
               <button
                      className={styles.viewBtn}
                      onClick={() => handleViewDetails(recommendation)}
                    >View</button>
               </div>
               </div>
                <div className={styles.listCon}>
                    <table className={styles.recommendationTable}>
                        <thead>
                            <tr>
                                <th>Scheme</th>
                                <th>Score</th>
                                <th>ROI (%)</th>
                                <th>Best Month</th>
                                <th>Best Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRecommendations.map((recommendation, index) => (
                                <tr key={index}>
                                    <td>{recommendation.scheme}</td>
                                    <td>
                                        <ProgressCircle score={recommendation.score} />
                                    </td>
                                    <td>{recommendation.details.ROI}</td>
                                    <td>{recommendation.details.best_month}</td>
                                    <td>{recommendation.details.best_duration}</td>
                                    <td>
                                        <button
                                            className={styles.addEventBtn}
                                            onClick={() => handleAddEvent(recommendation)}
                                        >
                                            Add Event
                                        </button>
                                      
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
          <ul>
        <li>
          **Top Performing Schemes:** The schemes with the highest scores are the
          **Fixed Deposits (0.91)** and the **National Savings Certificate (0.82)**,
          indicating their strong suitability based on the target criteria.
        </li>
        <li>
          **Lowest Performing Schemes:** The **Rural Postal Life Insurance (0.60)** and
          **Postal Life Insurance (0.65)** have the lowest scores, suggesting they may
          require further evaluation or adjustments to improve their effectiveness.
        </li>


        <li>
          **Best Months for Investment:** The schemes have specific months where they perform best,
          with schemes like **Sukanya Samriddhi Yojana** and **Post Office Saving Account** performing well in
          January, while others like **Rural Postal Life Insurance** and **Kisan Vikas Patra** show better
          results in the summer months like May and August.
        </li>
        
      </ul>
            <button className={styles.closeBtn} onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
        </div>
    );
};
export default RecommendationPage;
