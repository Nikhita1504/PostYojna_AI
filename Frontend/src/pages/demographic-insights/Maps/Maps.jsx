import React, { useEffect, useState, useRef } from "react";
import L, { marker } from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk"; // Import MaptilerLayer properly
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Maps.module.css"

const Maps = () => {
    // const coordinatess = [23.459015530719405, 77.39182263717896];
    // const [currentCity, setCurrentCity] = useState("Bihar");
    // const [markerInstance, setMarkerInstance] = useState(null);
    // const location = useLocation();

    // const locationpoint = location.state?.locationpoint;
    // const coordinatess = [locationpoint.lat, locationpoint.lon];

    // const navigate = useNavigate();


    // function createPopupContent(city) {
    //     return `
    //     <div>
    //       <b>View Demographics for: ${city}</b>
    //       <br />
    //       <button id="viewDataButton" >View Data</button>
    //     </div>
    //   `;
    // }

    // function getLocationDetailsFromMapTiler(lat, lng) {
    //     const apiKey = "HueEivR2h00OamtE2H00"; // Replace with your API key
    //     const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`;

    //     fetch(url)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             var cityName = data.features[1].place_name_en;
    //             setCurrentCity(cityName);
    //             console.log(currentCity);
    //             createPopupContent(cityName);

    //         })
    //         .catch((error) =>
    //             console.error("Error fetching location details:", error)
    //         );
    // }



    // useEffect(() => {

    //     // Initialize the map
    //     const map = L.map("map", {
    //         center: coordinatess || [20.5937, 78.9629], // Center of India
    //         zoom: 1,
    //         minZoom: 5, // Set minimum zoom level
    //         maxZoom: 12, //
    //     });

    //     var marker = L.marker(coordinatess).addTo(map);
    //     setMarkerInstance(marker);


    //     // Function to move the marker to the new coordinates
    //     function moveMarker(coordinates) {
    //         marker.setLatLng(coordinates);
    //     }


    //     map.on("click", (e) => {
    //         const { lat, lng } = e.latlng;
    //         var coordinates = [lat, lng];
    //         moveMarker(coordinates);
    //         map.setView(coordinates, 7);
    //         getLocationDetailsFromMapTiler(lat, lng);
    //     });

    //     if (coordinatess && coordinatess.length === 2) {
    //         moveMarker(coordinatess);
    //         map.setView(coordinatess, 10);
    //         getLocationDetailsFromMapTiler(coordinatess[0], coordinatess[1]);
    //     }

    //     marker.on("popupopen", function () {
    //         marker.openPopup();
    //         const button = document.getElementById("viewDataButton");
    //         if (button) {
    //             button.addEventListener("click", () => {

    //             });
    //         }
    //     });

    //     // Add the MapTiler Layer
    //     const mtLayer = new MaptilerLayer({
    //         apiKey: "HueEivR2h00OamtE2H00", // Replace with your MapTiler API key
    //         style: "https://api.maptiler.com/maps/basic-v2/style.json", // Choose a MapTiler style
    //     });

    //     // Add the layer to the map
    //     mtLayer.addTo(map);

    //     // Optional: Add scale or other controls
    //     L.control.scale().addTo(map);

    //     return () => {
    //         map.off("zoomend");
    //         map.remove();
    //     };
    // }, []);

    // useEffect(() => {
    //     if (markerInstance) {
    //         markerInstance.bindPopup(createPopupContent(currentCity)).openPopup();
    //         markerInstance.on("popupopen", () => {
    //             const button = document.getElementById("viewDataButton");
    //             if (button) {
    //                 button.addEventListener("click", () => {
    //                     console.log("View data for:", currentCity);
    //                 });
    //             }
    //         });
    //     }
    // }, [currentCity, markerInstance]);


    // return (
    //     <div>
    //         <h1>MapTiler Vector Map Example</h1>
    //         <div
    //             id="map"
    //             className={styles.mapsContainer}
    //         ></div>
    //     </div>
    // );

  const [currentCity, setCurrentCity] = useState("Bihar");
  const [markerInstance, setMarkerInstance] = useState(null);
   const location = useLocation();

    const locationpoint = location.state?.locationpoint;
    const coordinatess = [locationpoint.lat, locationpoint.lon];
  
  function createPopupContent(city) {
    return `
      <div>
        <b>View Demographics for: ${city}</b>
        <br />
        <button id="viewDataButton">View Data</button>
      </div>
    `;
  }

  function getLocationDetailsFromMapTiler(lat, lng) {
    const apiKey = "HueEivR2h00OamtE2H00"; // Replace with your API key
    const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        var cityName = data.features[1].place_name_en;
        setCurrentCity(cityName);
        console.log(currentCity);
        createPopupContent(cityName);
        
      })
      .catch((error) =>
        console.error("Error fetching location details:", error)
      );
  }



  useEffect(() => {

    // Initialize the map
    const map = L.map("map", {
      center: coordinatess || [20.5937, 78.9629], // Center of India
      zoom: 5,
      minZoom: 5, // Set minimum zoom level
      maxZoom: 12, //
    });

    var marker = L.marker(coordinatess).addTo(map);
    setMarkerInstance(marker);


    // Function to move the marker to the new coordinates
    function moveMarker(coordinates) {
      marker.setLatLng(coordinates);
    }


    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      var coordinates = [lat, lng];
      moveMarker(coordinates);
      map.setView(coordinates, 7);
      getLocationDetailsFromMapTiler(lat, lng);  
    });

    if (coordinatess && coordinatess.length === 2) {
      moveMarker(coordinatess);
      map.setView(coordinatess, 10);
      getLocationDetailsFromMapTiler(coordinatess[0], coordinatess[1]);
    }

    // marker.on("popupopen", function () {
    //   marker.openPopup();
    //   const button = document.getElementById("viewDataButton");
    //   if (button) {
    //     button.addEventListener("click", () => {
         
    //     });
    //   }
    // });

    // Add the MapTiler Layer
    const mtLayer = new MaptilerLayer({
      apiKey: "HueEivR2h00OamtE2H00", // Replace with your MapTiler API key
      style: "https://api.maptiler.com/maps/basic-v2/style.json", // Choose a MapTiler style
    });

    // Add the layer to the map
    mtLayer.addTo(map);

    // Optional: Add scale or other controls
    L.control.scale().addTo(map);
   
    return () => {
      map.off("zoomend");
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (markerInstance) {
      markerInstance.bindPopup(createPopupContent(currentCity)).openPopup();
      markerInstance.on("popupopen", () => {
        const button = document.getElementById("viewDataButton");
        if (button) {
          button.addEventListener("click", () => {
            console.log("View data for:", currentCity);
          });
        }
      });
    }
  }, [currentCity, markerInstance]);


  return (
    <div>
      <h1>MapTiler Vector Map Example</h1>
      <div
        id="map"
        style={{
          width: "100%",
          height: "100vh",
          border: "1px solid #ccc",
        }}
      ></div>
    </div>
  );


}

export default Maps
