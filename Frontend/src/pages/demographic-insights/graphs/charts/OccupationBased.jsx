import * as React from 'react';
import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip, AccumulationSelection, Inject, Selection, AccumulationAnnotationsDirective, AccumulationAnnotationDirective, ChartAnnotation, AccumulationAnnotation } from '@syncfusion/ej2-react-charts';
import { Browser } from '@syncfusion/ej2-base';

const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
    }
    .pie-chart2 {
        align :center
    }`;

const Doughnut = ({ data }) => {
    const load = (args) => {
        let selectedTheme = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Fluent2';
        args.accumulation.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/light/i, "Light").replace(/contrast/i, 'Contrast').replace(/-highContrast/i, 'HighContrast');
    };

    return (
        <div className="control-pane">
            <style>{SAMPLE_CSS}</style>
            <div className="control-section">
                <AccumulationChartComponent
                    id="pie-chart2"


                    load={load.bind(this)}
                    legendSettings={{
                        visible: true,
                        toggleVisibility: false,
                        position: Browser.isDevice ? 'Bottom' : 'Right',
                        height: Browser.isDevice ? '20%' : '30%',
                        width: Browser.isDevice ? '80%' : '20%',
                        textWrap: 'Wrap',
                        textStyle: {  fontWeight: '600', color:"#fff" },

                        maximumLabelWidth: 66,
                    }}
                    enableSmartLabels={true}
                    enableAnimation={false}
                    selectionMode={'Point'}
                    center={{ x: '50%', y: '50%' }}
                    enableBorderOnMouseMove={false}
                    tooltip={{ enable: true, format: '<b>${point.x}</b><br>Occupation Share: <b>${point.y}%</b>', header: "" }}
                >
                    <Inject services={[AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip, AccumulationSelection, Selection, ChartAnnotation, AccumulationAnnotation]} />
                    <AccumulationSeriesCollectionDirective>
                        {/* Male Data */}
                        <AccumulationSeriesDirective
                            dataSource={data}
                            xName="name"
                            yName="Male"
                            name="Male"
                            explode={false}
                            explodeOffset="10%"
                            explodeIndex={0}
                            startAngle={30}
                            innerRadius="43%"
                            dataLabel={{
                                visible: true,
                                position: 'Inside',
                                name: 'Male',
                                font: { fontWeight: '600', color: '#ffffff', },
                                connectorStyle: { length: '20px', type: 'Curve' },
                            }}
                            radius="100%"
                        />
                        {/* Female Data */}
                        <AccumulationSeriesDirective
                            dataSource={data}
                            xName="name"
                            yName="Female"
                            name="Female"
                            explode={false}
                            explodeOffset="10%"
                            explodeIndex={0}
                            startAngle={30}
                            innerRadius="43%"
                            dataLabel={{
                                visible: true,
                                position: 'Inside',
                                name: 'Female',
                                font: { fontWeight: '600', color: '#ffffff',size:"18px"},
                                connectorStyle: { length: '20px', type: 'Curve' },
                            }}
                            radius="80%"
                        />
                    </AccumulationSeriesCollectionDirective>
                    <AccumulationAnnotationsDirective>
                        <AccumulationAnnotationDirective  region="Series" x="52%" y="50%" />
                    </AccumulationAnnotationsDirective>
                </AccumulationChartComponent>
            </div>
        </div>
    );
};

export default Doughnut;
