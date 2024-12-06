import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie"; // For the pie chart
import styles from './Dashboard.module.css'; // Import the CSS module
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import {
  Chart as ChartJS,
  ArcElement,        // Required for Pie Chart
  LineElement,      // Required for Line Chart
  CategoryScale,    // X-axis scale
  LinearScale,      // Y-axis scale
  PointElement,     // Points on Line Chart
  Tooltip,          // Tooltip plugin
  Legend,           // Legend plugin
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUsers, FaChartLine, FaUserPlus, FaDollarSign } from 'react-icons/fa'; // Import the icons
import { BiRupee } from 'react-icons/bi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import DashboardBarChart from "./DashboardLineChart";

ChartJS.register(
  ArcElement,        // Needed for Pie chart
  LineElement,       // Needed for Line chart
  CategoryScale,     // X-axis scale for categorical data
  LinearScale,       // Y-axis scale
  PointElement,      // Points on Line chart
  Tooltip,           // Tooltip plugin
  Legend             // Legend plugin
);
// Mock data
const mockTransactions = [
  { txId: "SSA Mela", user: "GyanJyoti Public School", date: "15-10-24", cost: "View" },
  { txId: "SCSS Awareness", user: "Jamburi maidan", date: "29-12-24", cost: "View" },
  { txId: "PLI Drive", user: "Jamburi Maidan", date: "17-01-25", cost: "View" },
  { txId: "Codeathon", user: "Tech Society", date: "01-12-24", cost: "View" },
  { txId: "AI Summit", user: "LNCT University", date: "22-11-24", cost: "View" },
  { txId: "Hackathon 2023", user: "LNCT University", date: "12-11-23", cost: "View" },
  { txId: "Web Dev Workshop", user: "LNCT College", date: "03-10-23", cost: "View" },
  { txId: "Data Science Meetup", user: "Indore Techies", date: "25-08-23", cost: "View" },
  { txId: "Cybersecurity Seminar", user: "AIIMS", date: "10-07-23", cost: "View" },
  { txId: "Startup Pitch", user: "Startup Hub", date: "16-06-23", cost: "View" },
];

const customerDemographicsData = [
  { id: "Children", label: "Children", value: 25, color: "hsl(348, 70%, 50%)" },
  { id: "Adults", label: "Adults", value: 50, color: "hsl(91, 70%, 50%)" },
  { id: "Seniors", label: "Seniors", value: 25, color: "hsl(209, 70%, 50%)" },
];

const schemes = [
  "Senior Citizens Savings Scheme Account",
  "Sukanya Samriddhi Account",
  "Kisan Vikas Patra",
  "Mahila Samman Savings Certificate",
  "Public Provident Fund",
  "Postal Life Insurance",
  "Rural Postal Life Insurance",
];
const metrics = [
  {
    icon: <FaUsers size={43} color="#3A57E8" />,
    title: 'Total Population',
    value: '44,441',
    progress: 75, // Progress in percentage
  },
  {
    icon: <FaChartLine size={43} color="#3A57E8" />,
    title: 'Traffic Generated',
    value: '25,134',
    progress: 50,
  },
  {
    icon: <FaUserPlus size={43} color="#3A57E8" />,
    title: 'Total Accounts Opened',
    value: '15,345',
    progress: 60,
  },
  {
    icon: <BiRupee size={43} color="#3A57E8" />,
    title: 'Total Funds Deposited',
    value: 'Rs 1,12,361',
    progress: 90,
  },
];
const lineData = {
  labels: ['1 Year', '5 Years', '10 Years'], // X-axis labels
  datasets: [
    {
      label: 'Scheme Progress',
      data: [30, 70, 120], // Example data
      borderColor: '#3A57E8',
      backgroundColor: 'rgba(58, 87, 232, 0.1)',
      borderWidth: 2,
      tension: 0.4, // Makes line smooth
    },
  ],
};

const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // Hide legend
    },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      grid: { color: '#e5e5e5' },
    },
  },
};

// Data for Pie Chart
const pieData = {
  labels: ['Funds Used', 'Funds Remaining'],
  datasets: [
    {
      label: 'Fund Allocation',
      data: [60, 40], // Example data
      backgroundColor: ['#3A57E8', '#d6d6d6'], // Colors
      borderWidth: 0,
    },
  ],
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom', // Position the legend
    },
  },
};
const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedScheme, setSelectedScheme] = useState(schemes[0]);

  const handleSchemeChange = (e) => setSelectedScheme(e.target.value);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '' || searchQuery.length <= 3) return;

    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3000/search', {
        params: { query: searchQuery },
      });

      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle selecting a location from the list
  const handleSelectLocation = (location) => {
    setSelectedLocation({
      display_name: location.display_name,
      lat: location.lat,
      lon: location.lon,
    });


    setLocations([]);
    setSearchQuery(location.display_name);
  };


  // Reset selectedLocation if user navigates back from the graph page
  useEffect(() => {
    if (location.pathname !== '/demographic-insights/graphs') {
      setSelectedLocation(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (searchQuery.length > 3) {
      handleSearch({ preventDefault: () => { } });
    } else {
      setLocations([]);
    }
  }, [searchQuery]);


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
            <select value={selectedScheme} onChange={handleSchemeChange} className={styles.dropdown}>
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
                onClick={() => handleSelectLocation(location)}
              >
                <FaMapMarkerAlt className={styles.locationIcon} />
                {location.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
      {loading && (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
        </div>
      )}


      {/* Metrics Section */}
      <div className={styles.content}>
        <div className={styles.metricsSection}>
          {metrics.map((metric, index) => (
            <div className={styles.metricCard} key={index}>

              <div className={styles.metricCardData}>
                <div className={styles.metricIcon}>{metric.icon}</div>

                <h4>{metric.title}</h4>
                <p>{metric.value}</p>
              </div>

              <div style={{ width: '80px', height: '80px' }}>
                <CircularProgressbar
                  value={metric.progress}
                  text={`${metric.progress}%`}
                  styles={buildStyles({
                    pathColor: '#3A57E8',
                    textColor: '#3A57E8',
                    trailColor: '#d6d6d6',
                    textSize: '20px', // Font size of the text inside the circle
                  })}
                />
              </div>

            </div>

          ))}
        </div>

        {/* Charts Section */}
        <div className={styles.charts}>
          <div className={styles.progresschart}>
            <DashboardBarChart isDashboard={true} scheme={selectedScheme} />

          </div>
          <div className={styles.recentTransactions}>
            <h3>Recent Transactions</h3>
            <div className={styles.transactionList}>
              {mockTransactions.map((transaction, index) => (
                <div className={styles.transactionItem} key={index}>
                 <div className={styles.transactiondata}>
                 <div className={styles.id}>{transaction.txId}</div>
                  <div className={styles.user}>{transaction.user}</div>
                 </div>
                  <div>{transaction.date}</div>
                  <button className={styles.viewButton}>{transaction.cost}</button>
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
