import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart, Scatter,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  LabelList,
} from 'recharts';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Parallax, Pagination, Navigation } from 'swiper/modules';
import './styles.css';
import PieCornerRadius from './charts/PieChart';
import Column from './charts/BarChart';
import CylindricalColumn from './charts/CylindricalColumn';
import OccupationBased from './charts/OccupationBased';
import Doughnut from './charts/OccupationBased';
import ApexChart from './charts/HeatMap';
import SeasonalDemandChart from './charts/CylindricalColumn';
import { useLocation } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { Line } from 'react-chartjs-2';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GraphSwiper = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { locationName } = location.state || {};
  console.log(locationName);
  const [toggle, setToggle] = useState('Age Group-Based');
  const swiperRef = useRef(null);
  const [ageData, setageData]
    = useState(null);
  const [currlocation, setcurrlocation] = useState("");
  const [fetchDistrict, setFetchingDistrict] = useState(true);

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

  // Fetch data from backend API

  // const fetchData = async () => {
  //   try {
  //     const location = currlocation.district;
  //     const response = await axios.get('http://localhost:3000/demographic-data/get', {
  //       params: {location}
  //     });
  //     console.log(response.data)
  //     setGraphData(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, [currlocation])

  // const fetchRegionData = async () => {
  //   try {
  //     const Location = currlocation.district;
  //     const response = await axios.get('http://localhost:3000/demographic-data/getdemographicData', {
  //       params: { Location }
  //     });

  //     setGraphData(response.data);
  //     console.log(graphData)
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   // fetchData();
  //   fetchRegionData();
  // }, [currlocation])
  const fetchPopulationData = async () => {
    try {
      const Location = currlocation.district;
      const response = await axios.get('http://localhost:3000/demographic-data/getPopulationData', {
        params: { Location }
      });
      setGraphData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    // fetchData();
    fetchPopulationData();
  }, [currlocation])

  const fetchAgeData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/demographic-data/getAgedata")
      console.log(response.data)
      setageData(response.data)


    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchAgeData();
  }, [])



  // Prepare data for charts
  const getPopulationData = () =>
    graphData
      ? [
        { name: 'Male Population', value: graphData.Male },
        { name: 'Female Population', value: graphData.Female },
      ]
      : [];

  const formattedData = getPopulationData().map(item => ({
    x: item.name,
    y: item.value
  }));



  // const getAgeGroupData = () =>
  //   graphData
  //     ? [
  //       { name: '0-10', Male: graphData.age_group_population.male['0-10'], Female: graphData.age_group_population.female['0-10'] },
  //       { name: '11-59', Male: graphData.age_group_population.male['11-59'], Female: graphData.age_group_population.female['11-59'] },
  //       { name: '60+', Male: graphData.age_group_population.male['60+'], Female: graphData.age_group_population.female['60+'] },
  //     ]
  //     : [];

  const getAgeGroupData = () => {
    if (!graphData || !graphData.age_distribution) return [];

    // Parse the age distribution percentages into an array of numbers
    const ageDistributionPercentages = graphData.age_distribution
      .split(", ")
      .map((percent) => parseFloat(percent.replace("%", "")));

    // Calculate the population for each age group based on the percentages
    const totalPopulation = graphData.Male + graphData.Female;
    const [childPercentage, youthPercentage, adultPercentage, seniorPercentage] =
      ageDistributionPercentages;

    return [
      { name: "Child", value: Math.round((childPercentage / 100) * totalPopulation) },
      { name: "Youth", value: Math.round((youthPercentage / 100) * totalPopulation) },
      { name: "Adults", value: Math.round((adultPercentage / 100) * totalPopulation) },
      { name: "Senior Citizens", value: Math.round((seniorPercentage / 100) * totalPopulation) },
    ];
  };

  
  const genderRatioData = graphData
    ? [{ name: "Gender Ratio", value: graphData.gender_ratio, fill: "#8884d8" }]
    : [];


  const getOccupationData = () =>
    graphData
      ? [
        { name: 'Agriculture', Male: graphData.occupation_based_population.male.agriculture, Female: graphData.occupation_based_population.female.agriculture },
        { name: 'Service', Male: graphData.occupation_based_population.male.service, Female: graphData.occupation_based_population.female.service },
        { name: 'Business', Male: graphData.occupation_based_population.male.business, Female: graphData.occupation_based_population.female.business },
        { name: 'Others', Male: graphData.occupation_based_population.male.others, Female: graphData.occupation_based_population.female.others },
        { name: 'Non-working', Male: graphData.occupation_based_population.male.non_working, Female: graphData.occupation_based_population.female.non_working },
      ]
      : [];

  const getColorByDemandType = (demandType) => {
    switch (demandType) {
      case 'low':
        return '#C7FFA4'; // Light blue
      case 'medium':
        return '#FEAA00'; // Yellow
      case 'high':
        return '#89141C'; // Red
      default:
        return '#D5DBDB'; // Grey for unexpected values
    }
  };
  const thresholds = {
    gender_ratio: { low: 0.95, high: 1.05 },
    education_level: { low: 50, high: 75 },
    income_level: { low: 1000000, high: 2000000 },
  };
  const getTag = (value, threshold) => {
    if (value < threshold.low) {
      return 'Low';
    } else if (value >= threshold.low && value <= threshold.high) {
      return 'Medium';
    } else {
      return 'High';
    }
  };

  const data = graphData
    ? [
      {
        name: "Gender Ratio",
        value: graphData.gender_ratio,
        tag: getTag(graphData.gender_ratio, thresholds.gender_ratio),
      },
      {
        name: "Education Level",
        value: graphData.education_level,
        tag: getTag(graphData.education_level, thresholds.education_level),
      },
      {
        name: "Income Level",
        value: graphData.income_level,
        tag: getTag(graphData.income_level, thresholds.income_level),
      },
    ]
    : []; // Corrected to return a valid array

  const getBubbleColor = (tag) => {
    const colors = {
      High: "#4caf50",   // Green
      Medium: "#ff9800", // Orange
      Low: "#f44336",    // Red
    };
    return colors[tag];
  };

  const recommendations = [
    {
      scheme: "Sukanya Samriddhi Yojana",
      score: 0.85,
      details: {
        ROI: 12.5,
        target_gender: "Female",
        risk_level: "Low",
        genre: "Savings",
      },
    },





    {
      scheme: "Senior Citizen Savings Scheme",
      score: 0.90,
      details: {
        ROI: 8.0,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
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
      },
    },
    {
      scheme: "Fixed Deposits",
      score: 0.74,
      details: {
        ROI: 6.8,
        target_gender: "Both",
        risk_level: "Low",
        genre: "Savings",
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
      },
    },

  ];
  const riskColors = {
    Low: "#4CAF50",
    Medium: "#FFC107",
    High: "#F44336",
  };

  const renderPrimaryRecommendation = () => (
    <ResponsiveContainer width={900} height={400}>
     <BarChart data={recommendations.slice(0, 3)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="scheme" fontSize={13} />
  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
  <Tooltip />
  <Legend />
  <Bar yAxisId="left" dataKey="score" fill="#FEA800" onClick={handleBarClick}>
    {recommendations.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={riskColors[entry.details.risk_level] || "#2196F3"}  // Default color if no risk level found
      />
    ))}
    <LabelList dataKey="score" position="top" formatter={(value) => `${(value * 100).toFixed(1)}%`} />
  </Bar>
  <Line yAxisId="right" type="monotone" dataKey="details.ROI" stroke="#ff7300" />
</BarChart>

    </ResponsiveContainer>
  );

  const renderSchemeComparison = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={recommendations}
          dataKey="details.ROI"
          nameKey="scheme"
          cx="50%"
          cy="50%"
          outerRadius={120}
          innerRadius={60}
          paddingAngle={5}
          label={(entry) => `${entry.scheme} (${entry.details.ROI}%)`}
        >
          {recommendations.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={riskColors[entry.details.risk_level] || "#2196F3"} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  // const staticRecommendations = [
  //   {
  //     scheme: "Sukanya Samriddhi Yojana",
  //     score: 0.85,
  //     details: {
  //       ROI: 12.5,
  //       target_gender: "Female",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Post Office Saving Account",
  //     score: 0.75,
  //     details: {
  //       ROI: 10.1,
  //       target_gender: "Female",
  //       risk_level: "Low",
  //       genre: "General",
  //     },
  //   },
  //   {
  //     scheme: "Public Provident Fund",
  //     score: 0.70,
  //     details: {
  //       ROI: 7.1,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Post Office Recurring Deposit Account",
  //     score: 0.78,
  //     details: {
  //       ROI: 6.9,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Post Office Time Deposit Account",
  //     score: 0.80,
  //     details: {
  //       ROI: 7.5,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Post Office Monthly Income Scheme",
  //     score: 0.76,
  //     details: {
  //       ROI: 7.4,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Income",
  //     },
  //   },
  //   {
  //     scheme: "Senior Citizen Savings Scheme",
  //     score: 0.90,
  //     details: {
  //       ROI: 8.0,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Postal Life Insurance",
  //     score: 0.65,
  //     details: {
  //       ROI: 5.5,
  //       target_gender: "Both",
  //       risk_level: "Medium",
  //       genre: "Insurance",
  //     },
  //   },
  //   {
  //     scheme: "Rural Postal Life Insurance",
  //     score: 0.60,
  //     details: {
  //       ROI: 5.2,
  //       target_gender: "Both",
  //       risk_level: "Medium",
  //       genre: "Insurance",
  //     },
  //   },
  //   {
  //     scheme: "National Savings Certificate",
  //     score: 0.82,
  //     details: {
  //       ROI: 7.5,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Kisan Vikas Patra",
  //     score: 0.72,
  //     details: {
  //       ROI: 7.7,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Fixed Deposits",
  //     score: 0.74,
  //     details: {
  //       ROI: 6.8,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Recurring Deposits",
  //     score: 0.77,
  //     details: {
  //       ROI: 6.7,
  //       target_gender: "Both",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  //   {
  //     scheme: "Mahila Samman Savings Certificate",
  //     score: 0.88,
  //     details: {
  //       ROI: 7.6,
  //       target_gender: "Female",
  //       risk_level: "Low",
  //       genre: "Savings",
  //     },
  //   },
  // ];
  

  const seasonalDemandData = graphData ? graphData.seasonal_demand_for_money : [];
  const handleToggle = (value, slideIndex) => {
    setToggle(value);
    if (swiperRef.current) {
      swiperRef.current.slideTo(slideIndex); // Navigate to corresponding slide
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  // if (fetchingDistrict) {
  //   return <p>Loading district data...</p>; // Loader for district fetching
  // }

  if (!graphData) {
    return <p>Error loading data.</p>;
  }

  return (
    <div className="bigCon">

      <div className="innerCon">
        {fetchDistrict && (
          <div className="loader">
            <HashLoader style={{ position: "relative", right: "12%" }} size={50} color="#3A57E8" />
          </div>
        )}
        <img src="/assets/fullbanner.png" alt="" />

        <div className="toggleButton">

          {/* <button
          onClick={() => handleToggle("Age Group-Based", 1)}
          className={`toggle-option ${toggle === "Age Group-Based" ? "active" : ""}`}
        >
          Age Group-Based
        </button>
        <button
          onClick={() => handleToggle("Population-Based", 0)}
          className={`toggle-option ${toggle === "Population-Based" ? "active" : ""}`}
        >
          Population-Based
        </button>
        <button
          onClick={() => handleToggle("Others", 2)}
          className={`toggle-option ${toggle === "Others" ? "active" : ""}`}
        >
          Others
        </button> */}
        </div>
        <div className="graphCon">
          <div className="swipper">
            <Swiper
              style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff',
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
              <div
                slot="container-start"
                className="parallax-bg"
                style={{
                  // backgroundImage:
                  //   'url(https://cdn.pixabay.com/photo/2023/04/10/19/49/ai-generated-7914562_960_720.jpg)',
                  // opacity: "0.4"
                  backgroundColor: "white",
                  // boxShadow: "0px 4px 15px 5px rgba(255, 255, 255, 0.3)"
                }}
                data-swiper-parallax="-23%"
              >  </div>



              {/* Population Pie Chart */}
              <SwiperSlide onSwiper={(swiper) => (swiperRef.current = swiper)}>
                <div className="graphBox1">
                  <p>Population Based Chart</p>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={recommendations}
                        dataKey="details.ROI"
                        nameKey="scheme"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={5}
                        label={(entry) => `${entry.scheme} (${entry.details.ROI}%)`}
                      >
                        {recommendations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={"#2196F3"} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* <PieCornerRadius data={formattedData} /> */}
                </div>
              </SwiperSlide>
              <SwiperSlide onSwiper={(swiper) => (swiperRef.current = swiper)}>
                <div className="graphBox1">
                  <p>Population Based Chart</p>
                  <ResponsiveContainer width={800} height={400}>
                    <BarChart
                      data={recommendations.slice(0, 3)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scheme" fontSize={13} />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="score" fill="#8884d8" >
                        {recommendations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={riskColors[entry.details.risk_level] || "#2196F3"} />
                        ))}
                        <LabelList dataKey="score" position="top" formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                      </Bar>
                      <Line yAxisId="right" type="monotone" dataKey="details.ROI" stroke="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                  {/* <PieCornerRadius data={formattedData} /> */}
                </div>
              </SwiperSlide>
              <SwiperSlide onSwiper={(swiper) => (swiperRef.current = swiper)}>
                <div className="graphBox1">
                  <p>Population Based Chart</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPopulationData()}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        innerRadius={50}
                        fill="#8884d8"
                      >
                        {getPopulationData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* <PieCornerRadius data={formattedData} /> */}
                </div>
              </SwiperSlide>

              {/* Age Group Bar Chart */}
              <SwiperSlide onSwiper={(swiper) => (swiperRef.current = swiper)}>
                <div className="graphBox1">
                  <p>Age Group Chart</p>
                  <ResponsiveContainer width="100%" height={370}>
                  <BarChart data={getAgeGroupData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>



                  {/* <Column ageGroupData={getAgeGroupData()} /> */}
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