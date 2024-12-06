import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie"; // For the pie chart
import styles from './Dashboard.module.css'; // Import the CSS module
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";


// Mock data
const mockTransactions = [
  { txId: "SSA Mela", user: "GyanJyoti Public School", date: "15-10-24", cost: "View" },
  { txId: "SCSS Awareness", user: "Jamburi maidan", date: "29-12-24", cost: "View" },
  { txId: "PLI Drive", user: "Jamburi Maidan", date: "17-01-25", cost: "View" },
  // Additional transactions can be added here...
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
    navigate('/demographic-insights/graphs', { state: location });
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



          </div>


        </div>
      </div>
      {loading && (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
        </div>
      )}


      {/* Metrics Section */}
      <div className={styles.content}>
        {/* <div className={styles.metricsSection}>
          <div className={styles.metricCard}>
            <h3>Total Population</h3>
            <p>44,441</p>
          </div>
          <div className={styles.metricCard}>
            <h3>Traffic Generated</h3>
            <p>25,134</p>
          </div>
          <div className={styles.metricCard}>
            <h3>Total Accounts Opened</h3>
            <p>15,345</p>
          </div>
          <div className={styles.metricCard}>
            <h3>Total Funds Deposited</h3>
            <p>Rs 1,12,361</p>
          </div>
        </div> */}

        {/* Charts Section */}
        <div className={styles.chartsSection}>
          {/* Pie Chart */}
          {/* <div className={styles.chartContainer}>
            <h3>Customer Demographics</h3>
            <ResponsivePie
              data={customerDemographicsData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ datum: "data.color" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              radialLabelsSkipAngle={10}
              radialLabelsTextColor="#333"
              radialLabelsLinkColor={{ from: "color" }}
              sliceLabelsSkipAngle={10}
              sliceLabelsTextColor="#333"
            />
          </div> */}

          {/* Transactions Table */}
          {/* <div className={styles.transactionsContainer}>
            <h3>Upcoming Melas</h3>
            <table className={styles.transactionsTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.txId}</td>
                    <td>{tx.user}</td>
                    <td>{tx.date}</td>
                    <td>
                      <button className={styles.viewButton}>{tx.cost}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
