import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css"; 
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaChartLine, FaUserPlus, FaDollarSign } from "react-icons/fa"; 
import { BiRupee } from "react-icons/bi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DashboardBarChart from "./DashboardLineChart";
import CountUp from "react-countup";

import ReactStars from "react-rating-stars-component";

const schemes = [
  "Post Office Savings Account",
  "Post Office Recurring Deposit Account",
  "Post Office Time Deposit Account",
  "Post Office Monthly Income Scheme",
  "Senior Citizen Savings Scheme",
  "Public Provident Fund",
  "Sukanya Samriddhi Yojana",
  "Postal Life Insurance",
  "Rural Postal Life Insurance",
  "National Savings Certificate",
  "Kisan Vikas Patra",
  "Fixed Deposits",
  "Recurring Deposits",
  "Mahila Samman Savings Certificate",
];

const getIcon = (iconName) => {
  switch (iconName) {
    case "FaUsers":
      return <FaUsers size={30} color="#000000" />;
    case "FaChartLine":
      return <FaChartLine size={30} color="#000000" />;
    case "FaUserPlus":
      return <FaUserPlus size={30} color="#000000" />;
    case "BiRupee":
      return <BiRupee size={30} color="#000000" />;
    default:
      return null; 
  }
};

const Dashboard = () => {
  const [Feedback, SetFeedback] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);


  const location = useLocation();
  const [selectedScheme, setSelectedScheme] = useState(schemes[0]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [locationName, setlocationName] = useState("");
  const [dashboardData, setDashboardData] = useState({});

  

  const handleSchemeChange = (e) => {
    setSelectedScheme(e.target.value);
  };

  
  const fetchfeedback = async () => {
    SetFeedback([]);
    const response = await axios(
      `http://localhost:3000/feedback/scheme/${selectedScheme}`
    );
    // console.log(response.data);
    SetFeedback(response.data);
  };

  //fetch feedback
  useEffect(() => {
    fetchfeedback();
  }, [selectedScheme]);

  useEffect(() => {
    if (location.pathname !== "/demographic-insights/graphs") {
      setLocations([]);
    }
  }, [location.pathname]);

  const getDashboardData = async (locationname, schemeName) => {
    try {
      if (locationname) {
        const words = locationname.split(",");
        const locationArr = words.slice(-6);
        setlocationName(locationArr[0]);
      }
      const response = await axios.get(
        "http://localhost:3000/dashboard/getData",
        {
          params: {
            // city: locationName,
            scheme: schemeName,
          },
        }
      );
      // console.log(response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardData(debouncedSearchQuery, selectedScheme);
  }, [debouncedSearchQuery, selectedScheme]);

  const [selectedView, setSelectedView] = useState("Yearly");
  // console.log(dashboardData.registrationsOverYears);

  return (
    <div className={styles.dashboard}>
      {/* Header Section */}
      <div className={styles.dashboardCon}>
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            {/* <h1>Hey!</h1>
            <p>Welcome to your Dashboard</p> */}
            <img src="/assets/dashboardhead (1).png" alt="" />
          </div>
          <div className={styles.controls}>
            <select
              value={selectedScheme}
              onChange={handleSchemeChange}
              className={styles.dropdown}
            >
              {schemes.map((scheme, index) => (
                <option key={index} value={scheme}>
                  {scheme}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metrics Section */}
        <div className={styles.metricsSection}>
          {dashboardData.metrics && dashboardData.metrics.length > 0 ? (
            dashboardData.metrics.map((metric, index) => {
              const gradients = [
                "linear-gradient(135deg, #e3f2fd, #bbdefb)", // Light Blue
                "linear-gradient(135deg, #fbe9e7, #ffccbc)", // Light Orange
                "linear-gradient(135deg, #e8f5e9, #c8e6c9)", // Light Green
                "linear-gradient(135deg, #f3e5f5, #e1bee7)", // Light Purple
              ];

              return (
                <div
                  className={styles.metricCard}
                  key={index}
                  style={{ background: gradients[index % gradients.length] }} 
                >
                  <div className={styles.metricValues}>
                    {getIcon(metric.icon)}
                    <h6>{metric.title}</h6>
                    <p>
                      <CountUp
                        start={0}
                        end={parseInt(metric.value.replace(/[^0-9]/g, ""))}
                        duration={3.5}
                        separator=","
                      />
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No data Found</p>
          )}
        </div>


        {/* Charts and Feedback Section */}
        <div className={styles.mainContent}>

          <div className={styles.progresschart}>
            <div className={styles.progresschartHeader}>
              <h6>Account Registration Trends</h6>
              <div className={styles.buttons}>
                <button
                  className={`${styles.button} ${selectedView === "Monthly" ? styles.activeButton : ""
                    }`}
                  onClick={() => setSelectedView("Monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`${styles.button} ${selectedView === "Yearly" ? styles.activeButton : ""
                    }`}
                  onClick={() => setSelectedView("Yearly")}
                >
                  Yearly
                </button>

              </div>
            </div>
            {/* Add your chart component here */}
            <div className={styles.chartArea}>
            <DashboardBarChart view={selectedView} 
            registrationsOverYears={dashboardData.registrationsOverYears} />
            </div>
          </div>

          <div className={styles.feedback}>
            <h3>Recent Feedbacks</h3>
            <div className={styles.transactionList}>
              {Feedback.map((feedback, index) => (
                <div className={styles.feedbackContainer} key={index}>
                  <p className={styles.feedbackPoint}>{feedback.point}</p>
                  <div className={styles.lowercontainer}>
                    <span className={styles.feedbackLocation}>
                      📍 {feedback.location}
                    </span>
                    <ReactStars
                      count={5}
                      size={20}
                      isHalf={true}
                      value={feedback.rating}
                      activeColor="#FEBE00"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div >
  );
};

export default Dashboard;



