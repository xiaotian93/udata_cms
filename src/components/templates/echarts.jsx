import React, { Component } from 'react';
// import ReactEcharts from 'echarts-for-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import { Modal, Select ,Spin} from 'antd';
import {axios_json} from '../../ajax/request';
import ModalEchart from "./echartModal";
const { Option } = Select;
class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            setOption: {},
            data: props.data,
            modal:props.data,
            selectHost:props.data?props.data.uuid:""
            // selectHost:props.data.uuid

        };
        this.info=props.data?props.data.uuid:"";
    }
    componentWillMount() {
        var yAxisInfo = { type: 'value' }, tooltip = { trigger: 'axis' };
        if (this.props.text && (this.props.text === "cpu_percent" || this.props.text === "mem_percent" || this.props.text === "disk_percent")) {
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
        if (this.props.text && (this.props.text === "mem_total" || this.props.text === "mem_free" || this.props.text === "disk_total" || this.props.text === "disk_used")) {
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
        if (this.props.text && (this.props.text === "network_traffic_in" || this.props.text === "network_traffic_out")) {
            yAxisInfo = {
                type: 'value',
                name: "Mbps",
            }
        }
        this.option = {
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
                    myTool: {
                        show: true,
                        title: "大图",
                        icon: "M1014.237213 1013.761259a28.517906 28.517906 0 0 1-22.344547 10.118285h-287.979654a32.011123 32.011123 0 0 1 0-63.962019l210.345905 0.963647-345.105808-345.135922 45.201031-45.261259 345.527403 345.527403v-212.062399a31.981009 31.981009 0 1 1 63.962019 0L1023.90379 990.965003c0 8.973956-3.764243 16.984265-9.666577 22.796256z m-22.344547-661.753938a31.981009 31.981009 0 0 1-32.011123-32.011123l1.023874-210.345904-345.196149 345.105807-45.201032-45.261259L915.975411 64.027667h-212.062399a32.011123 32.011123 0 0 1 0-64.022246h287.076236c8.913728 0 16.984265 3.764243 22.796256 9.666576a28.608248 28.608248 0 0 1 10.058058 22.344547v287.979654c0 17.676886-14.334238 32.011123-31.950896 32.011123z m-582.373579 101.393653L63.991685 107.873571v212.122627a32.011123 32.011123 0 1 1-63.962019 0V32.919962C0.029666 24.006235 3.733681 15.935697 9.636014 10.123706A28.578134 28.578134 0 0 1 32.040789 0.005421h287.919427a32.011123 32.011123 0 0 1 0 64.022246l-210.345905-1.023874 345.166036 345.196149-45.26126 45.201032zM32.040789 671.937871c17.616658 0 31.950895 14.334238 31.950896 32.011124l-0.963647 210.345904 345.135922-345.166035 45.261259 45.261259L107.897816 959.917525h212.0624a31.981009 31.981009 0 1 1 0 63.962019H32.944208c-8.973956 0-16.984265-3.704015-22.796257-9.606348A28.668475 28.668475 0 0 1 0.029666 991.868421v-287.919426c0-17.676886 14.334238-32.011123 32.011123-32.011124z",
                        iconStyle: {
                            fontSize: 12
                        },
                        onclick: e => {
                            this.option.toolbox.feature.myTool.show = false
                            if(!this.props.hiddenSelect)this.onChange(this.info)
                            this.setState({
                                visible: true,
                                spin:false
                            })
                        }

                    }
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLabel: { interval: 25 }, // 间隔几个空格显示
                data: []
            },
            yAxis: yAxisInfo,
            series: [{
                data: [],
                type: "line"
            }]
        };
    }
    componentDidMount() {
        
    }
    cancel() {
        this.setState({
            visible: false,
            selectHost:this.props.data.uuid,
        })
        if(!this.props.hiddenSelect)this.onChange(this.info)
    }
    onChange(value) {
        this.setState({
            spin:true
        })
        axios_json.get(this.state.data.api+"?uuid="+value+"&start="+(this.state.data.startTime)+"&end="+(this.state.data.endTime)).then(e=>{
            var data=e.data,series_info=[];
            data.forEach(item=>{
                if(item.name===this.state.data.legend){
                    var data=item.data;
                    var series_data=[],series_json={};
                    data.forEach(j=>{
                        series_data.push(j[1])
                    series_json.data=series_data;
                series_json.name=item.name;
                series_json.type="line";
                    })
                    series_info.push(series_json);
                }

            })
            var modal=this.state.modal;
            modal.series_info = series_info;
            this.setState({
                modal:modal,
                selectHost:value,
                spin:false
            })
        }).catch(e=>{
            this.setState({
                spin:false
            })
        })
      }
      onBlur() {
        console.log('blur');
      }
      onFocus() {
        console.log('focus');
      }
      onSearch(val) {
        console.log('search:', val);
      }
    render() {
        var modal_info = {
            title: null,
            visible: this.state.visible,
            footer: null,
            onCancel: this.cancel.bind(this),
            width: "80%"
        }

        var data = this.props.data;
        if (data) {
            this.option.xAxis.data = data.dataX.map((i, k) => {
                i = i.slice(5);
                return i.replace(" ", "\n");
            });
            this.option.series = data.series_info;
            this.option.xAxis.axisLabel = { interval: parseInt(data.dataX.length / 6) }
        } else {
            this.option.xAxis.data = [];
            this.option.series = [{
                data: [],
                type: "line"
            }]
        }
        // this.modal=this.option;
        var optionData=JSON.parse(window.localStorage.getItem("listDada"));
        return (
            <div style={{ float: "left", "width": this.props.width || "30%", "height": "300px", "marginRight": this.props.right || 0 }}>
                <ReactEchartsCore option={this.option} style={{ "width": "100%", "height": "300px" }} echarts={echarts} />
                <Modal {...modal_info}>
                    {!this.props.hiddenSelect?<span>hostname：</span>:null}
                    {!this.props.hiddenSelect?<Select showSearch style={{ width: 200 }} placeholder="Select a hostname" optionFilterProp="children" onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} onSearch={this.onSearch.bind(this)} filterOption={(input, option) =>option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} value={this.props.data.uuid}>
                            {optionData.map((i,k)=>{
                                return <Option value={i.uuid} key={k}>{i.hostname}</Option>
                            })}
                        </Select>:null}
                    <Spin spinning={this.state.spin} ><ModalEchart data={this.state.modal} /></Spin>
                </Modal>
            </div>
        )
    }
}
export default Monitor