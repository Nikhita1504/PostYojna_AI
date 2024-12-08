import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";

const DashboardBarChart = ({ registrationsOverYears }) => {
  const theme = useTheme();

  // Check if data is available and is in the expected format
  if (!registrationsOverYears || registrationsOverYears.length === 0) {
    return <div>Loading...</div>; // Render a loading state or fallback
  }

  const colors = {
    grey: "#B0B0B0", // Lighter grey for axes
    primaryStart: "#079AA2", // Start color for gradient (light blue)
    primaryEnd: "#FFBB28", // End color for gradient (dark teal)
    background: "#F0F0F5", // Light lavender background color
    axisText: "#999999", // Lighter grey for axis text
  };

  return (
    <ResponsiveBar
      data={registrationsOverYears} // Use registrationsOverYears as the data source
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
      margin={{ top: 50, right: 110, bottom: 50, left: 80 }}
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
        legendOffset: -60,
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
      motionConfig="wobbly" // Use a gentle transition effect
    />
  );
};

export default DashboardBarChart;



// import React from 'react';
// import { ChartComponent, ColumnSeries, Category, DataLabel, Tooltip, SeriesDirective, SeriesCollectionDirective, Inject } from '@syncfusion/ej2-react-charts';
// import { Browser } from '@syncfusion/ej2-base';

// const CylindricalColumnDashboard = ({ data }) => {
//   const onChartLoad = (args) => {
//     let chart = document.getElementById('charts');
//     chart.setAttribute('title', '');
//   };

//   const load = (args) => {
//     let selectedTheme = location.hash.split('/')[1];
//     selectedTheme = selectedTheme ? selectedTheme : 'Fluent2';
//     args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/contrast/i, 'Contrast').replace(/-highContrast/i, 'HighContrast');
//   };

//   return (
//     <div className='control-pane'>
//       <div className='control-section'>
//         <ChartComponent 
//           id='charts' 
//           style={{ textAlign: "center" }} 
//           chartArea={{ border: { width: 0 } }} 
//           title='Registrations Over Years'
//           primaryXAxis={{
//             valueType: 'Category',
//             interval: 1,
//             majorGridLines: { width: 0 },
//             labelIntersectAction: Browser.isDevice ? 'None' : 'Trim',
//             labelRotation: Browser.isDevice ? -45 : 0,
//             majorTickLines: { width: 0 },
//             minorTickLines: { width: 0 }
//           }} 
//           primaryYAxis={{
//             title: 'Registrations',
//             majorTickLines: { width: 0 },
//             lineStyle: { width: 0 },
//             maximum: 200000,
//             interval: 25000
//           }} 
//           tooltip={{
//             enable: true,
//             header: "<b>${point.tooltip}</b>",
//             format: "Registrations: <b>${point.y}</b>"
//           }} 
//           load={load.bind(this)} 
//           loaded={onChartLoad.bind(this)} 
//           width={Browser.isDevice ? '100%' : '75%'}
//           height='300px' // Adjust overall height of the chart
//           enableAnimation={true} // Enable smooth animation
//           animationDuration={1500} 
//           animationEasing="EaseInOut" // Duration of the animation in milliseconds
//         >
//           <Inject services={[ColumnSeries, Category, DataLabel, Tooltip]} />
          
//           <SeriesCollectionDirective>
//             <SeriesDirective 
//               dataSource={data}
//               columnFacet='Cylinder'
//               type='Column' 
//               xName='year' 
//               yName='registrations' 
//               width={1}  // Adjust width to reduce cylinder height
//               columnSpacing={0.2} // Increase spacing between columns to reduce height perception
//               tooltipMappingName='year'>
//             </SeriesDirective>
//           </SeriesCollectionDirective>
//         </ChartComponent>
//       </div>
//     </div>
//   );
// };

// export default CylindricalColumnDashboard;

