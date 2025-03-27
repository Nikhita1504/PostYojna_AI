import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const PieArcLabel = ({ data }) => {
  const desktopOS = [
    { id: 'Male', value: data.Male || 0, color: '#34D399' },
    { id: 'Female', value: data.Female || 0, color: '#A78BFA' },
  ];

  const size = {
    width: 400,
    height: 300,
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

export default PieArcLabel;
