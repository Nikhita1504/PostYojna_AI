import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt } from 'react-icons/fa';
import styles from './DemographicInsights.module.css';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function DemographicInsights() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the current location

  // Function to handle the search and fetch data from backend
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

    console.log(location.lat);
    console.log(location.lon);
    setLocations([]);
    setSearchQuery(location.display_name);
    navigate('/demographic-insights/maps', { state: { locationpoint: location } });
  };


  // Reset selectedLocation if user navigates back from the graph page
  useEffect(() => {
    if (location.pathname !== '/demographic-insights/graphs') {
      setSelectedLocation(null);
    }
  }, [location.pathname]); // Trigger the effect whenever the location changes



  // Effect to trigger search after 3 characters are typed
  useEffect(() => {
    if (searchQuery.length > 3) {
      handleSearch({ preventDefault: () => { } });
    } else {
      setLocations([]);
    }
  }, [searchQuery]);

  return (
    <div className={styles.container}>

      <div className={styles.imageWrapper}>

        <img src="/assets/bg.png" alt="Background" className={styles.bannerImage} />
        <h2>View Insights</h2>
        {/* Input Field on the Image */}
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

      {/* Show Loading Spinner */}
      {loading && (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
        </div>
      )}

    </div>
  );
}

export default DemographicInsights;

