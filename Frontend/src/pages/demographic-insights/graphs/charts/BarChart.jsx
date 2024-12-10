import * as React from "react";
import { useEffect } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, ColumnSeries, DataLabel, Highlight } from '@syncfusion/ej2-react-charts';
import { Browser } from '@syncfusion/ej2-base';

const Column = ({ ageGroupData }) => {
    const loaded = (args) => {
        let chart = document.getElementById('charts');
        chart.setAttribute('title', '');
    };

    const load = (args) => {
        let selectedTheme = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Fluent2';
        args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1))
            .replace(/-dark/i, "Dark")
            .replace(/contrast/i, 'Contrast')
            .replace(/-highContrast/i, 'HighContrast');
        if (selectedTheme === 'highcontrast') {
            args.chart.series[0].marker.dataLabel.font.color = '#000000';
            args.chart.series[1].marker.dataLabel.font.color = '#000000';
            args.chart.series[2].marker.dataLabel.font.color = '#000000';
        }
    };

    // Calculate maximum population for setting Y-axis range
    const getMaxPopulation = () => {
        let maxMale = Math.max(ageGroupData[0].Male, ageGroupData[1].Male, ageGroupData[2].Male);
        let maxFemale = Math.max(ageGroupData[0].Female, ageGroupData[1].Female, ageGroupData[2].Female);
        return Math.max(maxMale, maxFemale);
    };

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <ChartComponent
                    id='charts'
                    style={{ textAlign: "center" }}
                    legendSettings={{ enableHighlight: true }}
                    primaryXAxis={{
                        labelIntersectAction: Browser.isDevice ? 'None' : 'Trim',
                        labelRotation: Browser.isDevice ? -45 : 0,
                        valueType: 'Category',
                        interval: 1,
                        majorGridLines: { width: 0 },
                        majorTickLines: { width: 0 }
                    }}
                    primaryYAxis={{
                        title: 'Population Count',
                        majorTickLines: { width: 0 },
                        lineStyle: { width: 0 },
                        maximum: getMaxPopulation() + 100000, // Set dynamic Y-axis max value
                        interval: 1000000 // Adjust interval for better readability
                    }}
                    chartArea={{ border: { width: 0 } }}
                    load={load.bind(this)}
                    tooltip={{
                        enable: true,
                        header: "<b>${point.tooltip}</b>",
                        shared: true
                    }}
                    width={Browser.isDevice ? '100%' : '75%'}
                    title='Age Group Population'
                    loaded={loaded.bind(this)}
                >
                    <Inject services={[ColumnSeries, Legend, Tooltip, Category, DataLabel, Highlight]} />
                    <SeriesCollectionDirective>
                        {/* Male Population Data */}
                        <SeriesDirective
                            dataSource={ageGroupData}
                            tooltipMappingName='name'
                            xName='name'
                            yName='Male'
                            name='Male'
                            type='Column'
                            fill='#003366'
                        />
                        {/* Female Population Data */}
                        <SeriesDirective
                            dataSource={ageGroupData}
                            tooltipMappingName='name'
                            xName='name'
                            yName='Female'
                            name='Female'
                            type='Column'
                            fill='#FEAA00'
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
            </div>
        </div>
    );
};

export default Column;
