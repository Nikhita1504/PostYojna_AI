// import * as React from 'react';
// import { useEffect } from "react";
// import { ChartComponent, ColumnSeries, Category, DataLabel, Tooltip, SeriesDirective, SeriesCollectionDirective, Inject } from '@syncfusion/ej2-react-charts';
// import { Browser } from '@syncfusion/ej2-base';

// // Accepting the seasonal_demand_for_money data as a prop
// const CylindricalColumn = ({ seasonalDemandData }) => {
//     const onChartLoad = (args) => {
//         let chart = document.getElementById('charts');
//         chart.setAttribute('title', '');
//     };

//     const load = (args) => {
//         let selectedTheme = location.hash.split('/')[1];
//         selectedTheme = selectedTheme ? selectedTheme : 'Fluent2';
//         args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/contrast/i, 'Contrast').replace(/-highContrast/i, 'HighContrast');
//     };

//     // Transform the seasonalDemandData to match the chart data format
//     const chartData = seasonalDemandData.map(item => ({
//         x: item.month, // Using the month as x-axis
//         y: item.demand_score, // Using demand_score as y-axis
//         tooltipMappingName: `${item.month}: ${item.demand_score} (${item.demand_type})` // Tooltip information
//     }));

//     return (
//         <div className="control-pane">
//             <div className="control-section">
//                 <ChartComponent
//                     id="charts"
//                     style={{ textAlign: "center" }}
//                     chartArea={{ border: { width: 0 } }}
//                     // title="Seasonal Demand for Money"
//                     primaryXAxis={{
//                         valueType: 'Category',
//                         interval: 1,
//                         majorGridLines: { width: 0 },
//                         labelIntersectAction: Browser.isDevice ? 'None' : 'Trim',
//                         labelRotation: Browser.isDevice ? -45 : 0,
//                         majorTickLines: { width: 0 },
//                         minorTickLines: { width: 0 },
//                     }}
//                     primaryYAxis={{
//                         title: 'Demand Score',
//                         majorTickLines: { width: 0 },
//                         lineStyle: { width: 0 },
//                         maximum: 100,
//                         interval: 10,
//                     }}
//                     tooltip={{
//                         enable: true,
//                         header: "<b>${point.tooltip}</b>",
//                         format: "Demand Score: <b>${point.y}</b>",
//                     }}
//                     load={load}
//                     loaded={onChartLoad}
//                     width={Browser.isDevice ? '100%' : '75%'}
//                 >
//                     <Inject services={[ColumnSeries, Category, DataLabel, Tooltip]} />
//                     <SeriesCollectionDirective>
//                         <SeriesDirective
//                             dataSource={chartData}
//                             columnFacet="Cylinder"
//                             type="Column"
//                             xName="x"
//                             yName="y"
//                             width={2}
//                             columnSpacing={0.1}
//                             tooltipMappingName="tooltipMappingName"
//                         />
//                     </SeriesCollectionDirective>
//                 </ChartComponent>
//             </div>
//         </div>
//     );
// };

// export default CylindricalColumn;

import * as React from 'react';
import { ChartComponent, ColumnSeries, Category, DataLabel, Tooltip, Inject, SeriesDirective, SeriesCollectionDirective } from '@syncfusion/ej2-react-charts';

const SeasonalDemandChart = ({ seasonalDemandData }) => {
  const chartData = seasonalDemandData.map(item => ({
    x: item.month,
    y: item.demand_score,
    demandType: item.demand_type
  }));

  return (
    <div className='control-pane'>
      <div className='control-section'>
        <ChartComponent
          id='charts'
          title="Seasonal Demand for Money"
          primaryXAxis={{
            valueType: 'Category',
            labelRotation: 45
          }}
          primaryYAxis={{
            title: 'Demand Score',
            maximum: 100,
            interval: 10
          }}
          tooltip={{
            enable: true,
            header: "<b>${point.x}</b>",
            format: "Demand Score: <b>${point.y}</b><br>Type: <b>${point.demandType}</b>"
          }}
        >
          <Inject services={[ColumnSeries, Category, DataLabel, Tooltip]} />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={chartData}
              type='Column'
              xName='x'
              yName='y'
              columnSpacing={0.1}
              tooltipMappingName="demandType"
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  );
};

export default SeasonalDemandChart;
