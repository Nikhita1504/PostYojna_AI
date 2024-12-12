import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie"; // For the pie chart
import styles from "./Dashboard.module.css"; // Import the CSS module
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import {
  Chart as ChartJS,
  ArcElement, // Required for Pie Chart
  LineElement, // Required for Line Chart
  CategoryScale, // X-axis scale
  LinearScale, // Y-axis scale
  PointElement, // Points on Line Chart
  Tooltip, // Tooltip plugin
  Legend, // Legend plugin
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUsers, FaChartLine, FaUserPlus, FaDollarSign } from "react-icons/fa"; // Import the icons
import { BiRupee } from "react-icons/bi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DashboardBarChart from "./DashboardLineChart";
import CountUp from "react-countup";
import CylindricalColumn from "../demographic-insights/graphs/charts/CylindricalColumn";
import CylindricalColumnDashboard from "./DashboardLineChart";

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
      return <FaUsers size={30} color="#3A57E8" />;
    case "FaChartLine":
      return <FaChartLine size={30} color="#3A57E8" />;
    case "FaUserPlus":
      return <FaUserPlus size={30} color="#3A57E8" />;
    case "BiRupee":
      return <BiRupee size={30} color="#3A57E8" />;
    default:
      return null; // Fallback in case the icon name is not recognized
  }
};

const Dashboard = () => {
  const [Feedback, SetFeedback] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedScheme, setSelectedScheme] = useState(schemes[0]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [locationName, setlocationName] = useState("");
  const [dashboardData, setDashboardData] = useState({});
  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSchemeChange = (e) => {
    setSelectedScheme(e.target.value);
  };

  const handleSearch = async (query) => {
    if (!query || query.trim() === "" || query.length <= 3) return;

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/search/location",
        {
          params: { query },
        }
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const fetchfeedback = async () => {
    SetFeedback([]);
    const response = await axios(
      `http://localhost:3000/feedback/scheme/${selectedScheme}`
    );
    console.log(response.data);
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
      console.log(response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardData(debouncedSearchQuery, selectedScheme);
  }, [debouncedSearchQuery, selectedScheme]);



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
            dashboardData.metrics.map((metric, index) => (
              <div className={styles.metricCard} key={index}>
                <div className={styles.metricValues}>
                  {/* {metric.icon} */}
                  <h4>{metric.title}</h4>
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
            ))
          ) : (
            <p>No data Found</p>
          )}
        </div>

        {/* Charts and Feedback Section */}
        <div className={styles.mainContent}>
          <div className={styles.progresschart}>
            <DashboardBarChart
              isDashboard={true}
              scheme={selectedScheme}
              registrationsOverYears={dashboardData.registrationsOverYears}
            />
          </div>

          <div className={styles.feedback}>
            <h3>Feedbacks</h3>
            <div className={styles.transactionList}>
              {Feedback.map((feedback, index) => (
                <div className={styles.feedbackContainer} key={index}>
                  <p className={styles.feedbackPoint}> {feedback.point}</p>
                  <div className={styles.lowercontainer}>
                    <span className={styles.feedbackLocation}>📍 {feedback.location}</span>
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
    </div>
  );
};

export default Dashboard;
