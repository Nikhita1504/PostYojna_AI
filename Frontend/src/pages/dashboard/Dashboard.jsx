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
import CountUp from 'react-countup';
import CylindricalColumn from "../demographic-insights/graphs/charts/CylindricalColumn";
import CylindricalColumnDashboard from "./DashboardLineChart";




const schemes = [
  "Sukanya Samriddhi Account",
  "Senior Citizens Savings Scheme Account",

  "Kisan Vikas Patra",
  "Mahila Samman Savings Certificate",
  "Public Provident Fund",
  "Postal Life Insurance",
  "Rural Postal Life Insurance",
  "Post Office Savings Account",
];


const getIcon = (iconName) => {
  switch (iconName) {
    case "FaUsers":
      return <FaUsers size={43} color="#3A57E8" />;
    case "FaChartLine":
      return <FaChartLine size={43} color="#3A57E8" />;
    case "FaUserPlus":
      return <FaUserPlus size={43} color="#3A57E8" />;
    case "BiRupee":
      return <BiRupee size={43} color="#3A57E8" />;
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
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
    if (!query || query.trim() === '' || query.length <= 3) return;

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/search/location', {
        params: { query },
      });
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
    console.log(selectedScheme);
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
    if (location.pathname !== '/demographic-insights/graphs') {
      setLocations([]);
    }
  }, [location.pathname]);

  const getDashboardData = async (locationname, schemeName) => {
    try {
      if (locationname) {
        const words = locationname.split(',');
        const locationArr = words.slice(-6);
        setlocationName(locationArr[0]);

      }


      const response = await axios.get('http://localhost:3000/dashboard/getData', {
        params: {
          // city: locationName,
          scheme: schemeName,
        },
      });
      console.log(response.data)
      setDashboardData(response.data);

    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    getDashboardData(debouncedSearchQuery, selectedScheme);
  }, [debouncedSearchQuery, selectedScheme])

  return (
    <div className={styles.dashboard}>
      {/* Header Section */}

      <div className={styles.imageWrapper}>
        <img src="/assets/bg.png" className={styles.backgroundImage} alt="" />
        <div className={styles.dashboardHeader}>
          <div>
            <h1>Hey!</h1>
            <p>Welcome to your Dashboard</p>
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
      </div>

      <div className={styles.inputWrapper}>
        <FaMapMarkerAlt className={styles.icon} />
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
        />
        {locations.length > 0 && (
          <div className={styles.suggestions}>
            {locations.map((location, index) => (
              <div
                key={index}
                className={styles.suggestionItem}
                onClick={() => {
                  setSearchQuery(location.display_name); // Update search query
                  setLocations([]); // Clear suggestions
                }}
              >
                <FaMapMarkerAlt className={styles.locationIcon} />
                {location.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && <div className={styles.loader}><HashLoader size={50} color="#3A57E8" /></div>}

      {/* Metrics Section */}
      <div className={styles.content}>
        <div className={styles.metricsSection}>
          {dashboardData.metrics && dashboardData.metrics.length > 0 ? (
            dashboardData.metrics.map((metric, index) => (
              <div className={styles.metricCard} key={index}>
                <div className={styles.metricCardData}>
                  <div className={styles.metricIcon}>
                    {getIcon(metric.icon)}
                  </div>

                  <div className={styles.metricValues}>
                    <h4>{metric.title}</h4>
                    <p>
                      <CountUp
                        start={0}
                        end={parseInt(metric.value.replace(/[^0-9]/g, ''))} // Convert value to a number, removing non-numeric characters (like Rs)
                        duration={3.5} // Duration of the animation in seconds
                        separator="," // For thousand separator
                      />
                    </p>
                  </div>
                </div>

                {/* <div style={{ width: "80px", height: "80px" }}>
                  <CircularProgressbar
                    value={metric.progress}
                    text={`${metric.progress}%`}
                    styles={buildStyles({
                      pathColor: "#3A57E8",
                      textColor: "#3A57E8",
                      trailColor: "#d6d6d6",
                      textSize: "20px", // Font size of the text inside the circle
                    })}
                  />
                </div> */}
              </div>
            ))
          ) : (
            <p>No data Found</p> // Displayed if no metrics data is found
          )}
        </div>

        {/* Charts Section */}
        <div className={styles.charts}>
          <div className={styles.progresschart}>
            <DashboardBarChart isDashboard={true} scheme={selectedScheme} registrationsOverYears={dashboardData.registrationsOverYears} />
            {/* <CylindricalColumnDashboard className={styles.barChart} data={dashboardData.registrationsOverYears} /> */}
          </div>
          <div className={styles.recentTransactions}>
            <h3>Feedbacks</h3>
            <div className={styles.transactionList}>
              {Feedback.map((feedback, index) => (
                <div className={styles.transactionItem} key={index}>
                  <div className={styles.transactiondata}>
                    <div className={styles.id}>{feedback.location}</div>
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
