import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";

const mockBarData = [
  {
    year: 2018,
    registrations: 12,
  },
  {
    year: 2019,
    registrations: 18,
  },
  {
    year: 2020,
    registrations: 10,
  },
  {
    year: 2021,
    registrations: 25,
  },
  {
    year: 2022,
    registrations: 20,
  },
  {
    year: 2023,
    registrations: 30,
  },
];

const DashboardBarChart = ({ isCustomBarColors = false, isDashboard = false }) => {
  const theme = useTheme();

  const colors = {
    grey: "#B0B0B0", // Lighter grey for axes
    primaryStart: "#079AA2", // Start color for gradient (light blue)
    primaryEnd: "#F36325", // End color for gradient (dark teal)
    background: "#F0F0F5", // Light lavender background color
    axisText: "#999999", // Lighter grey for axis text
  };

  return (
    <ResponsiveBar
      data={mockBarData}
      keys={['registrations']} // Specify the field to use for the bars' values
      indexBy="year" // Specify the field to use for the bars' categories
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey, strokeWidth: 2 } },
          legend: { text: { fill: colors.axisText } },
          ticks: {
            line: { stroke: colors.grey, strokeWidth: 2 },
            text: { fill: colors.axisText, fontWeight: "bold" },
          },
        },
        legends: {
          text: { fill: colors.black },
        },
        tooltip: {
          container: { color: colors.primaryStart },
        },
      }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "band", padding: 0.3 }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Year",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Registrations",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      background={colors.background}
      barThickness={30}
      barBorderRadius={5}
      fill={[
        {
          match: "*", // Apply gradient to all bars
          id: "gradient1",
          value: 1,
        },
      ]}
      defs={[
        {
          id: "gradient1",
          type: "linearGradient",
          colors: [
            { offset: 0, color: colors.primaryStart }, // Start with light blue (#079AA2)
            { offset: 1, color: colors.primaryEnd },   // End with dark teal (#064144)
          ],
          // Adjusting the gradient direction to create a more noticeable effect
          x1: "0%",
          y1: "100%",
          x2: "100%",
          y2: "0%",
        },
      ]}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true} // Enable transitions/animations
      motionConfig="stiff" // Use a gentle transition effect
    />
  );
};

export default DashboardBarChart;
