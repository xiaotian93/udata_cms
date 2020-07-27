import React, { Component } from 'react';
import { DatePicker, Button,Spin } from 'antd';
import Echarts from '../templates/echarts';
import { axios_json } from '../../ajax/request';
import moment from 'moment';
import { get_all_traffic_info } from '../../ajax/api';
const { RangePicker } = DatePicker;
class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            cpu_data: [],
            startTime: moment().subtract(1, "days").format("YYYY-MM-DD") + " 00:00:00",
            endTime: moment().subtract(0, "days").format("YYYY-MM-DD HH:mm")+ ":00",
            defaultTime:[moment(moment().subtract(1,"days").format("YYYY-MM-DD")+" 00:00"),moment()]

        };
        this.loader = [];
    }
    componentWillMount() {

    }
    componentDidMount() {
        this.get_cpu(get_all_traffic_info, "cpu_data");
    }
    get_cpu(api, status, start, end, disk) {
        this.setState({
            spin:true
        })
        axios_json.get(api + "?start=" + (start || this.state.startTime) + "&end=" + (end || this.state.endTime)).then(e => {
            var data = e.data, dataX = [], cpu_data = [];
            for (var k in data[0].data) {
                dataX.push(data[0].data[k][0])
            }
            for (var i in data) {
                var base = data[i].data;
                var series_data = [], series_json = {};
                for (var j in base) {
                    var series_info = [];
                    series_data.push(base[j][1])
                    series_json.data = series_data;
                    series_json.name = data[i].name;
                    series_json.type = "line";
                    series_info.push(series_json);
                    var cpu_json = {
                        series_info: series_info,
                        dataX: dataX,
                        legend: data[i].name
                    }
                }
                cpu_data.push(cpu_json);
            }
            this.setState({
                [status]: cpu_data,
                spin:false
            })
        }).catch(e=>{
            this.setState({
                spin:false
            })
        })
    }
    onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        var start = dateString[0];
        var end = dateString[1];
        this.setState({
            startTime: start,
            endTime: end,
            defaultTime:value
        })
        // this.get_cpu(start,end)
    }

    cpu_change() {
        this.setState({
            cpu_data: [],
        })
        this.get_cpu(get_all_traffic_info, "cpu_data", this.state.startTime, this.state.endTime);
    }

    render() {
        const RangePickerInfo={
            showTime:{ format: 'HH:mm' ,defaultValue:[moment('00:00', 'HH:mm'),moment('23:59', 'HH:mm')]},
            format:"YYYY-MM-DD HH:mm",
            onChange:this.onChange.bind(this),
            value:this.state.defaultTime
        }
        return (
            <div className="">
                <div className="card">
                    <div className="card_content">
                        <div className="card" style={{ overflow: "hidden" }}>
                        <Spin spinning={this.state.spin}>
                            <div style={{ marginBottom: "10px" }}>
                                <span>选择时间：</span>
                                <RangePicker {...RangePickerInfo} />
                                <Button type="primary" size="small" onClick={this.cpu_change.bind(this)} style={{ marginLeft: "10px" }}>确定</Button>
                            </div>
                            
                            {
                                this.state.cpu_data.map((i, k) => {
                                    return <Echarts title="CPU使用率" api="" width="45%" data={i} key={k} right={(Number(k) === this.state.cpu_data.length - 1) ? "0" : "5%"} hiddenSelect />
                                })
                            }
                            </Spin>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Monitor