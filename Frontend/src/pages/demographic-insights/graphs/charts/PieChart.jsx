import * as React from 'react';
import { useEffect } from 'react';
import { Browser } from '@syncfusion/ej2-base';
import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationAnnotation, AccumulationDataLabel, AccumulationAnnotationDirective, AccumulationAnnotationsDirective } from '@syncfusion/ej2-react-charts';
// const chartData = [
//     { x: 'Operations', y: 30.0, text: '30.0%' },
//     { x: 'Miscellaneous', y: 10.0, text: '10.0%' },
//     { x: 'Human Resources', y: 15.0, text: '15.0%' },
//     { x: 'Research and Development', y: 20.0, text: '20.0%' },
//     { x: 'Marketing', y: 25.0, text: '25.0%' },
// ];
const onPointRender = (args) => {
    let selectedTheme = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    if (selectedTheme.indexOf('dark') > -1) {
        if (selectedTheme.indexOf('material') > -1) {
            args.border.color = '#303030';
        }
        else if (selectedTheme.indexOf('bootstrap5') > -1) {
            args.border.color = '#212529';
        }
        else if (selectedTheme.indexOf('bootstrap') > -1) {
            args.border.color = '#1A1A1A';
        }
        else if (selectedTheme.indexOf('fabric') > -1) {
            args.border.color = '#201f1f';
        }
        else if (selectedTheme.indexOf('fluent') > -1) {
            args.border.color = '#252423';
        }
        else if (selectedTheme.indexOf('bootstrap') > -1) {
            args.border.color = '#1A1A1A';
        }
        else if (selectedTheme.indexOf('tailwind') > -1) {
            args.border.color = '#1F2937';
        }
        else {
            args.border.color = '#222222';
        }
    }
    else if (selectedTheme.indexOf('highcontrast') > -1) {
        args.border.color = '#000000';
    }
    else {
        args.border.color = '#FFFFFF';
    }
};
const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
    }
    .pie-chart {
        align: center;
    }
`;
const PieCornerRadius = ({ data }) => {
    const onChartLoad = () => {
        document.getElementById('pie-chart').setAttribute('title', '');
    };

    const load = (args) => {
        let selectedTheme = location.hash.split('/')[1] || 'Fluent2';
        args.accumulation.theme = selectedTheme.charAt(0).toUpperCase() +
            selectedTheme.slice(1)
                .replace(/-dark/i, "Dark")
                .replace(/light/i, "Light")
                .replace(/contrast/i, 'Contrast')
                .replace(/-highContrast/i, 'HighContrast');
    };

    return (
        <div className="control-pane">
            <div className="control-section row">
                <AccumulationChartComponent
                    id="pie-chart"
                    load={load}
                    style={{ textAlign: "center" }}
                    legendSettings={{
                        visible: true,       // Enable the legend
                        position: 'Right',  // Positioning the legend
                        shape: 'Circle',     // Shape of legend items
                        height: '15px',      // Height of legend items
                        width: '15px',       // Width of legend items
                        textStyle: { size: '14px', fontWeight: '600', }
                    }}
                    enableSmartLabels
                    enableAnimation={false}
                    center={{ x: '50%', y: '50%' }}
                    enableBorderOnMouseMove={false}
                    width={Browser.isDevice ? '100%' : '75%'}
                    tooltip={{
                        enable: true,
                        header: "<b>Population</b>",
                        format: "${point.x}: <b>${point.y}</b>"
                    }}
                    loaded={onChartLoad}
                >
                    <Inject services={[PieSeries, AccumulationTooltip, AccumulationDataLabel, AccumulationAnnotation]} />
                    <AccumulationSeriesCollectionDirective>

                        <AccumulationSeriesDirective
                            dataSource={data}
                            name="Population"
                            xName="x"
                            yName="y"
                            type="Pie"
                            innerRadius="50%"
                            explode={true}  // Explodes the slices to create space
                            dataLabel={{
                                visible: true,
                                position: 'Outside',
                                name: 'x',
                                connectorStyle: { width: 0 },
                                font: { 
                                    size: '18px', 
                                    color: "#ffffff"  // Corrected the color property here
                                },
                                style: {
                                    background: '#ffffff', // Background color for data labels
                                    borderRadius: '4px',  // Optional: rounded corners for the background
                                    padding: '5px' // Optional: padding around the label text
                                }
                            }}
                            borderRadius={5}
                            border={{ width: 1, color: '#000' }}
                            explodeAll
                            explodeOffset="2%"
                        // Adds a border to each section
                        />



                    </AccumulationSeriesCollectionDirective>
                </AccumulationChartComponent>
            </div>
        </div>
    );
};

export default PieCornerRadius;
