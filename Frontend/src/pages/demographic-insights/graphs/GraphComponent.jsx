import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GraphSwiper = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { locationName } = location.state || {};
  console.log(locationName);

  const [currlocation, setcurrlocation] = useState("");

  const fetchdistrict = async () => {
    const newPrompt = {
      address: locationName,
      myprompt:
        "You have been provided with a full address. Your task is to analyze the address and extract the district and state from it. Return only the following JSON object: { district: <district>, state: <state> }. Do not include any other data in the response. If the district or state cannot be determined, leave the corresponding field empty (e.g., district:  or state: )"
    };

    try {
      const response = await axios.post("http://localhost:3000/Gemini/get-district", { newPrompt })
      console.log(response.data)
      setcurrlocation(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(currlocation.district);

  useEffect(() => {
    fetchdistrict(locationName);

  }, []);

  // Fetch data from backend API

  const fetchData = async () => {
    try {
      const location = currlocation.district;
      const response = await axios.get('http://localhost:3000/demographic-data/get', {
        params: {location}
      });
      console.log(response.data)
      setGraphData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currlocation])



  // Prepare data for charts
  const getPopulationData = () =>
    graphData
      ? [
        { name: 'Male Population', value: graphData.population.male },
        { name: 'Female Population', value: graphData.population.female },
      ]
      : [];

  const formattedData = getPopulationData().map(item => ({
    x: item.name,
    y: item.value
  }));



  const getAgeGroupData = () =>
    graphData
      ? [
        { name: '0-10', Male: graphData.age_group_population.male['0-10'], Female: graphData.age_group_population.female['0-10'] },
        { name: '11-59', Male: graphData.age_group_population.male['11-59'], Female: graphData.age_group_population.female['11-59'] },
        { name: '60+', Male: graphData.age_group_population.male['60+'], Female: graphData.age_group_population.female['60+'] },
      ]
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


  const seasonalDemandData = graphData ? graphData.seasonal_demand_for_money : [];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!graphData) {
    return <p>Error loading data.</p>;
  }

  return (
    <div className="bigCon">
     
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
            backgroundImage:
              'url(https://cdn.pixabay.com/photo/2023/04/10/19/49/ai-generated-7914562_960_720.jpg)',
            opacity: "0.4"
            // backgroundColor:"white"
          }}
          data-swiper-parallax="-23%"
        >  </div>



        {/* Population Pie Chart */}
        <SwiperSlide>
          <div className="graphBox1">
            <p>Population Based Chart</p>
            {/* <ResponsiveContainer width="100%" height={300}>
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
            </ResponsiveContainer> */}
            <PieCornerRadius data={formattedData} />
          </div>
        </SwiperSlide>

        {/* Age Group Bar Chart */}
        <SwiperSlide>
          <div className="graphBox1">
            <p>Age Group Chart</p>
            {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getAgeGroupData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Male" fill="#8884d8" />
                <Bar dataKey="Female" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer> */}
            <Column ageGroupData={getAgeGroupData()} />
          </div>
        </SwiperSlide>

        {/* Occupation Bar Chart */}
        <SwiperSlide>
          <div className="OccupationgraphBox1" >
            <p>Occupation Chart</p>
            {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getOccupationData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Male" fill="#FFBB28" />
                <Bar dataKey="Female" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer> */}
            <Doughnut data={getOccupationData()} />
          </div>
        </SwiperSlide>

        {/* Heatmap for Seasonal Demand */}
        <SwiperSlide>
          <div className="SeasongraphBox1">
            <p>Seasonal Demand Heatmap</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seasonalDemandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="demand_score"
                  fill="#8884d8" // Default fill color
                  shape={(props) => {
                    const { x, y, width, height, payload } = props;
                    const fillColor = getColorByDemandType(payload.demand_type); // Get the color based on demand type
                    return (
                      <rect x={x} y={y} width={width} height={height} fill={fillColor} />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            {/* <SeasonalDemandChart seasonalDemandData={seasonalDemandData} /> */}
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default GraphSwiper;