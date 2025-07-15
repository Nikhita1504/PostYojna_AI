import React, { useState, useEffect } from 'react';

import { FaMapMarkerAlt } from 'react-icons/fa';
import styles from './DemographicInsights.module.css';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function DemographicInsights() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 


  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '' || searchQuery.length <= 3) return;

    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3000/search/location', {
        params: { query: searchQuery },
      });

      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };


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
    navigate('/Home/demographic-insights/maps', { state: { locationpoint: location } });
  };



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

  const handleMapNavigate = () => {
    navigate('/Home/demographic-insights/maps')
  }

  return (
    <div className={styles.container}>
      <div className={styles.demographicCon}>
        <div className={styles.imageWrapper}>
        </div>


          <div className={styles.searchContainer}>
            <h2>View Demographic and Economic Visualization of any Region</h2>


            <div className={styles.inputWrapper}>
              <FaMapMarkerAlt className={styles.icon} />
              <input
                type="text"
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.input}
              />

            </div>
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
            <button className={styles.directviewonmapbutton} onClick={handleMapNavigate}>Directly Search in Map</button>
          </div>



        {loading && (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
          </div>
        )}

      </div>

    </div>
  );
}

export default DemographicInsights;