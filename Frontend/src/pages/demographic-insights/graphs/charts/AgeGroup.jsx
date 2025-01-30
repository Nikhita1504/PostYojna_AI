import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const AgeGroupChart = ({ data }) => {
  const desktopOS = [
    { id: '0-29', value: data.Age_Group_0_29 || 0, color: '#34D399' },
    { id: '30-50', value: data.Age_Group_30_49 || 0, color: '#A78BFA' },
    { id: 'Above 60', value: data.Age_Group_50 || 0, color: '#FBBF24' },
  ];

  const size = {
    width: 400,
    height: 400,
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Make the container height 100% of the viewport height
 // Optional: Set a background color for better visibility
      }}
    >
      <PieChart
        series={[
          {
            data: desktopOS,
            arcLabel: (item) => `${item.id}`,

            arcLabelMinAngle: 35,
            arcLabelRadius: '60%',
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            onMouseEnter: (event, { id }) => console.log(`Hovered on: ${id}`),
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: 'bold',
            fill: 'white', // Change label color to white
            fontSize: '14px',
          },
        }}
        legend={{
          position: 'bottom',
          direction: 'row',
          itemStyle: { color: 'white', fontSize: '14px' },
        }}
        {...size}
        aria-label="Pie Chart with Hover and Labels"
      />
    </div>
  );
};

export default AgeGroupChart;
