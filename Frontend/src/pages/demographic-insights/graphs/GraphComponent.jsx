import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Parallax, Pagination, Navigation } from "swiper/modules";
import "./styles.css";
import { useLocation } from "react-router-dom";
import PieActiveArc from "./charts/PieChart";
import data from "./datajson.json";
import BarChart from "./charts/BarChart";
import BarCharts from "./charts/BarChart";
import AgeGroupChart from "./charts/AgeGroup";

const GraphSwiper = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { locationName } = location.state || {};

  const [currlocation, setcurrlocation] = useState("");

  const fetchingDistrict = async () => {
    const newPrompt = {
      address: locationName,
      myprompt:
        "You have been provided with a full address. Your task is to analyze the address and extract the district and state from it. Return only the following JSON object: { district: <district>, state: <state> }.",
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/Gemini/get-district",
        { newPrompt }
      );
      setcurrlocation(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (locationName) {
      fetchingDistrict(locationName);
    }
    setLoading(false); // Ensure loading is updated
  }, [locationName]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bigCon">
      <div className="innerCon">
        <img src="/assets/fullbanner.png" alt="" />
        <div className="toggleButton">

</div>
        <div className="graphCon">
          <div className="swipper">
            <Swiper
              style={{
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
              }}
              speed={600}
              parallax={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Parallax, Pagination, Navigation]}
              className="mySwiper"
            >
              <SwiperSlide>
                <div className="graphBox1">
                  <p>Population-Based Chart</p>
                  <PieActiveArc data={data} />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="graphBox1">
                  <p>Occupation based chart</p>
                  <BarCharts data={data}/>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="graphBox1">
                  <p>Age Group Based Chart</p>
                  <AgeGroupChart data={data}/>
                </div>
              </SwiperSlide>
              
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphSwiper;
