import React, { Component } from 'react';
// import ReactEcharts from 'echarts-for-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import {datas} from '../detail/data';
import {Modal} from 'antd';
import {format_time} from '../../ajax/tool';
class Monitor extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title,
        };
        this.loader = [];
    }
    componentWillMount(){
        var info=this.getData(this.props.api)
        this.option={
            title: {
            text: this.state.title+"(周期：200s)",
                textStyle:{
                    fontSize:14
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: info.name,
                show:true,
                left:"center",
                top:"20px",
                textStyle:{
                    lineHeight:5
                }
            },
            
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                itemSize:10,
                showTitle:false,
                feature: {
                    myTool:{
                        show:true,
                        title:"大图",
                        icon:"M1014.237213 1013.761259a28.517906 28.517906 0 0 1-22.344547 10.118285h-287.979654a32.011123 32.011123 0 0 1 0-63.962019l210.345905 0.963647-345.105808-345.135922 45.201031-45.261259 345.527403 345.527403v-212.062399a31.981009 31.981009 0 1 1 63.962019 0L1023.90379 990.965003c0 8.973956-3.764243 16.984265-9.666577 22.796256z m-22.344547-661.753938a31.981009 31.981009 0 0 1-32.011123-32.011123l1.023874-210.345904-345.196149 345.105807-45.201032-45.261259L915.975411 64.027667h-212.062399a32.011123 32.011123 0 0 1 0-64.022246h287.076236c8.913728 0 16.984265 3.764243 22.796256 9.666576a28.608248 28.608248 0 0 1 10.058058 22.344547v287.979654c0 17.676886-14.334238 32.011123-31.950896 32.011123z m-582.373579 101.393653L63.991685 107.873571v212.122627a32.011123 32.011123 0 1 1-63.962019 0V32.919962C0.029666 24.006235 3.733681 15.935697 9.636014 10.123706A28.578134 28.578134 0 0 1 32.040789 0.005421h287.919427a32.011123 32.011123 0 0 1 0 64.022246l-210.345905-1.023874 345.166036 345.196149-45.26126 45.201032zM32.040789 671.937871c17.616658 0 31.950895 14.334238 31.950896 32.011124l-0.963647 210.345904 345.135922-345.166035 45.261259 45.261259L107.897816 959.917525h212.0624a31.981009 31.981009 0 1 1 0 63.962019H32.944208c-8.973956 0-16.984265-3.704015-22.796257-9.606348A28.668475 28.668475 0 0 1 0.029666 991.868421v-287.919426c0-17.676886 14.334238-32.011123 32.011123-32.011124z",
                        iconStyle:{
                            fontSize:12
                        },
                        onclick:e=>{
                            this.option.toolbox.feature.myTool.show=false
                            this.setState({
                                visible:true
                            })
                        }
                        
                    }
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel:{interval:50}, // 间隔几个空格显示
                data: info.dataX.map((i,k)=>{
                    var time=format_time(i);
                    return time.replace(" ","\n");
                })
            },
            yAxis: {
                type: 'value'
            },
            series: info.series_info
        };
    }
    getData(api){
        var dataX=[],data=datas.data,name=[],series_info=[];
            for(let i in data){
                name.push(data[i].name);
                var series_data=[],series_json={};
                for(var j in data[i].data){
                    series_data.push(data[i].data[j][1])
                }
                series_json.data=series_data;
                series_json.name=data[i].name;
                series_json.type="line";
                series_info.push(series_json)
            }
            for(var k in data[0].data){
                dataX.push(data[0].data[k][0])
            }
            return {
                dataX:dataX,
                series_info:series_info,
                name:name
            }
    }
    componentDidMount(){
    }
    cancel(){
        this.setState({
            visible:false
        })
    }
    render(){
        var modal_info={
            title:null,
            visible:this.state.visible,
            footer:null,
            onCancel:this.cancel.bind(this),
            width:"80%"
        }
        return (
            <div style={{float:"left","width":this.props.width||"30%","height":"300px","marginRight":this.props.right||0}}>
            <ReactEchartsCore option={this.option} style={{"width":"100%","height":"300px"}} echarts={echarts}></ReactEchartsCore>
            <Modal {...modal_info}>
            {/* <ReactEcharts option={this.option} style={{"width":"100%","height":"400px"}}></ReactEcharts> */}
            </Modal>
            </div>
        )
    }
}
export default Monitor