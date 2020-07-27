import React from 'react';
// import ReactEcharts from 'echarts-for-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
var Monitor=(props)=>{
        var yAxisInfo = { type: 'value' }, tooltip = { trigger: 'axis' };
        if (props.data.legend && (props.data.legend === "cpu_percent" || props.data.legend === "mem_percent" || props.data.legend === "disk_percent")) {
            yAxisInfo = {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                },
                toolbox: {
                    formatter: '{a}:{b}%'
                }
            }
            tooltip = {
                trigger: 'axis',
                formatter: '{b}</br>{a}:{c}%'
            }
        }
        if (props.data.legend && (props.data.legend === "mem_total" || props.data.legend === "mem_free" || props.data.legend === "disk_total" || props.data.legend === "disk_used")) {
            yAxisInfo = {
                type: 'value',
                name: "GB",
                axisLabel: {
                    formatter: (value) => (value / 1024 / 1024 / 1024).toFixed(2)
                }
            }
            tooltip = {
                trigger: 'axis',
                formatter: e => {
                    return e[0].name + "</br>" + e[0].seriesName + "：" + ((e[0].value / 1024 / 1024 / 1024).toFixed(2)) + "GB";
                }
            }
        }
        if (props.data.legend && (props.data.legend === "network_traffic_in" || props.data.legend === "network_traffic_out")) {
            yAxisInfo = {
                type: 'value',
                name: "Mbps",
            }
        }
        var option = {
            title: {
                text: "",
                textStyle: {
                    fontSize: 14
                },
            },
            tooltip: tooltip,
            legend: {
                // data: info.name,
                show: true,
                left: "center",
                top: "20px",
                textStyle: {
                    lineHeight: 5
                }
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                itemSize: 10,
                showTitle: false,
                feature: {
                    
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLabel: { interval: parseInt(props.data.dataX.length / 8) }, // 间隔几个空格显示
                data: props.data.dataX.map((i, k) => {
                    i = i.slice(5);
                    return i.replace(" ", "\n");
                })||[]
            },
            yAxis: yAxisInfo,
            series: props.data.series_info||[{
                data: [],
                type: "line"
            }]
        };
        // console.log(this.props.data)
        // var data = this.props.data;
        // if (data) {
        //     this.option.xAxis.data = data.dataX.map((i, k) => {
        //         i = i.slice(5);
        //         return i.replace(" ", "\n");
        //     });
        //     this.option.series = data.series;
        //     this.option.xAxis.axisLabel = { interval: parseInt(data.dataX.length / 6) }
        // } else {
        //     this.option.xAxis.data = [];
        //     this.option.series = [{
        //         data: [],
        //         type: "line"
        //     }]
        // }
        return <ReactEchartsCore option={option} style={{"width":"100%","height":"400px"}} echarts={echarts} />
}
export default Monitor