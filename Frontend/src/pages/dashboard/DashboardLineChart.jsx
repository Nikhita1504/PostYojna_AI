import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const DashboardBarChart = ({ view, registrationsOverYears }) => {
  if (!registrationsOverYears || registrationsOverYears.length === 0) {
    return <p>No data available</p>;
  }


  const xLabels = registrationsOverYears.map((item) => item.year);
  const data = registrationsOverYears.map((item) => item.registrations);

  return (
    <div>
      <BarChart
        width={500}
        height={300}
        series={[
          {
            data: data,
            label: `Registrations (${view})`, 
            id: "registrationsId",
            color: "#1A237E"
          },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </div>
  );
};

export default DashboardBarChart;




