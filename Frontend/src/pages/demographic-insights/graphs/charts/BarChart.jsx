import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const BarCharts = ({ data }) => {
  // Preparing dataset for the chart
  const dataset = [
    { occupation: 'Cultivators', value: data?.Cultivator_Workers || 0 },
    { occupation: 'Agricultural Workers', value: data?.Agricultural_Workers || 0 },
    { occupation: 'Household Workers', value: data?.Household_Workers || 0 },
  ];

  const chartSetting = {
    yAxis: [
      {
        label: 'Number of Workers',
      },
    ],
    xAxis: [
      {
        scaleType: 'band',
        dataKey: 'occupation',
        label: 'Occupation',
      },
    ],
    width: 500,
    height: 400,
    sx: {
      // Styling for y-axis label
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
        fontSize: '14px',
        fontWeight: 'bold',
        fill: 'white', // Y-axis label color
      },
      // Styling for x-axis label
      [`.${axisClasses.bottom} .${axisClasses.label}`]: {
        fontSize: '14px',
        fontWeight: 'bold',
        fill: 'white', // X-axis label color
      },
      // Styling for x-axis and y-axis tick values
      [`.${axisClasses.ticks} > text`]: {
        fill: 'white', // Tick values color
        fontSize: '12px',
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <BarChart
        dataset={dataset}
        series={[
          {
            dataKey: 'value',
            label: 'Workers',
            color: '#FBBF24', // Set bar color
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
};

export default BarCharts;
