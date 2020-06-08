import React, { Component } from 'react';
import TableCol from '../templates/TableCol_4';
import { Tabs,DatePicker,Select,Button } from 'antd';
import Echarts from '../templates/echarts';
import axios from '../../ajax/request';
import moment from 'moment';
import {get_base_info,get_cpu_info,get_mem_info,get_disk_list,get_disk_info,get_disk_util_list,get_disk_util_info,get_network_interface_list,get_network_info} from '../../ajax/api';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{},
            uuid:window.localStorage.getItem("uuid"),
            cpu_data:[],
            mem_data:[],
            disk_list:[],
            disk_data:[],
            startTime:moment().subtract(0,"days").format("YYYY-MM-DD")+ " 00:00:00",
            endTime:moment().subtract(0,"days").format("YYYY-MM-DD")+ " 23:59:59",
            disk_util_data:[],
            disk_util_list:[],
            network_list:[],
            network_data:[]
            // id:props.location.query.id
        };
        this.loader = [];
    }
    componentWillMount() {
        this.detailData = {
            agent_version: {
                name: "agent_version"
            },
            // connections: {
            //     name: "connections"
            // },
            // cpu_percent: {
            //     name: "cpu_percent"
            // },
            // disk_percent: {
            //     name: "disk_percent"
            // },
            // disk_util: {
            //     name: "disk_util"
            // },
            hostname: {
                name: "hostname"
            },
            ips: {
                name: "ips"
            },
            location: {
                name: "location"
            },
            machine_type: {
                name: "machine_type"
            },
            // mem_percent: {
            //     name: "mem_percent"
            // },
            omsa_status: {
                name: "omsa_status"
            },
            os_type: {
                name: "os_type"
            },
            os_version: {
                name: "os_version"
            },
            // pids: {
            //     name: "pids"
            // },
            report_time: {
                name: "os_type"
            },
            serial_num: {
                name: "serial_num"
            },
        }
        this.source = {
        }
    }
    componentDidMount() {
        this.get_detail();
        this.get_select();
        this.get_cpu(get_cpu_info,"cpu_data");
        this.get_cpu(get_mem_info,"mem_data");
        this.get_cpu(get_disk_info,"disk_data");
        this.get_cpu(get_disk_util_info,"disk_util_data");
        this.get_cpu(get_network_info,"network_data");
    }
    get_select(){
        axios.get(get_disk_list+"?uuid="+this.state.uuid).then(e=>{
            var data=e.data;
            this.setState({
                disk_list:data
            })
        })
        axios.get(get_disk_util_list+"?uuid="+this.state.uuid).then(e=>{
            var data=e.data;
            this.setState({
                disk_util_list:data
            })
        })
        axios.get(get_network_interface_list+"?uuid="+this.state.uuid).then(e=>{
            var data=e.data;
            this.setState({
                network_list:data,
                // network_value:data[0]
            })
        })
    }
    get_detail(){
        // var param={
        //     uuid:window.localStorage.getItem("uuid")
        // }
        axios.get(get_base_info+"?uuid="+window.localStorage.getItem("uuid")).then(e=>{
            var detail=e.data;
            delete detail.uuid;
            this.setState({
                data:detail
            })
        })
    

    }
    get_cpu(api,status,start,end,disk){
        axios.get(api+"?uuid="+this.state.uuid+"&start="+(start||this.state.startTime)+"&end="+(end||this.state.endTime)+(disk?("&"+disk.name+"="+disk.value):"")).then(e=>{
            var data=e.data,dataX=[],cpu_data=[];
            for(var k in data[0].data){
                dataX.push(data[0].data[k][0])
            }
            for(var i in data){
                var base=data[i].data;
                var series_data=[],series_json={};
                for(var j in base){
                    var series_info=[];
                    series_data.push(base[j][1])
                    series_json.data=series_data;
                series_json.name=data[i].name;
                series_json.type="line";
                series_info.push(series_json);
                var cpu_json={
                    series_info:series_info,
                    dataX:dataX
                }
                }
                cpu_data.push(cpu_json);
            }           
            this.setState({
                [status]:cpu_data
            })
        })
    }
    onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        var start=dateString[0];
        var end=dateString[1];
        this.setState({
            startTime:start,
            endTime:end
        })
        // this.get_cpu(start,end)
      }
      disk_change(){
        this.setState({
            disk_data:[],
        })
        this.get_cpu(get_disk_info,"disk_data",this.state.startTime,this.state.endTime,{name:"device",value:this.state.disk_value||""});
      }
      cpu_change(){
        this.setState({
            cpu_data:[],
            mem_data:[]
        })
        this.get_cpu(get_cpu_info,"cpu_data",this.state.startTime,this.state.endTime);
        this.get_cpu(get_mem_info,"mem_data",this.state.startTime,this.state.endTime);
      }
      change_select(value,name){
          console.log(value)
          this.setState({
              [name]:value
          })
      }
      disk_util_change(){
        this.setState({
            disk_util_data:[],
        })
        this.get_cpu(get_disk_util_info,"disk_util_data",this.state.startTime,this.state.endTime,{name:"device",value:this.state.disk_util_value||""});
      }
      network_change(){
        this.setState({
            network_data:[],
        })
        this.get_cpu(get_network_info,"network_data",this.state.startTime,this.state.endTime,{name:"interface",value:this.state.network_value||""});
      }
    render() {
        return (
            <div className="">
                <div className="card">
                    <div className="title">实例详情</div>
                    <div className="card_content">
                        <TableCol data-source={this.state.data} data-columns={this.detailData} />
                    </div>
                </div>
                <div className="card">
                    <div className="card_content">
                        <Tabs type="card">
                            <TabPane tab="操作系统监控" key="1">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={this.onChange.bind(this)}/>
                                    <Button type="primary" size="small" onClick={this.cpu_change.bind(this)} style={{marginLeft:"10px"}}>确定</Button>
                                </div>
                                <div style={{marginBottom:"20px"}}>
                                    <div className="echart_title">CPU状态</div>
                                    <div style={{overflow:"hidden"}}>
                                        {/* <Echarts title="CPU使用率" api="/api/get_cpu_info" width="30%" right="5%"></Echarts>
                                        <Echarts title="内存使用量" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="系统平均负载" api="" width="30%"></Echarts> */}
                                        {
                                            this.state.cpu_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="40%"  data={i} key={k} right={(Number(k)===this.state.cpu_data.length-1)?"0":"5%"}></Echarts>
                                            })
                                        }
                                    </div>
                                </div>
                                <div style={{marginBottom:"20px"}}>
                                    <div className="echart_title">内存信息</div>
                                    <div style={{overflow:"hidden"}}>
                                        {
                                            this.state.mem_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="30%"  data={i} key={k} right={(Number(k)===this.state.mem_data.length-1)?"0":"5%"}></Echarts>
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="磁盘状态" key="2">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={this.onChange.bind(this)}/>
                                    <Select style={{width:"150px",marginLeft:"10px"}} placeholder="请选择磁盘" onChange={(e)=>{this.change_select(e,"disk_value")}}>
                                    {
                                        this.state.disk_list.map((i,k)=>{
                                        return <Option value={i} key={k}>{i}</Option>
                                        })
                                    }
                                </Select>
                                <Button type="primary" size="small" onClick={this.disk_change.bind(this)} style={{marginLeft:"10px"}}>确定</Button>
                                </div>
                                
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                    {
                                            this.state.disk_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="30%"  data={i} key={k} right={(Number(k)===this.state.disk_data.length-1)?"0":"5%"}></Echarts>
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="磁盘负载详情" key="3">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={this.onChange.bind(this)}/>
                                    <Select style={{width:"150px",marginLeft:"10px"}} placeholder="请选择磁盘负载" onChange={(e)=>{this.change_select(e,"disk_util_value")}}>
                                    {
                                        this.state.disk_util_list.map((i,k)=>{
                                        return <Option value={i} key={k}>{i}</Option>
                                        })
                                    }
                                </Select>
                                <Button type="primary" size="small" onClick={this.disk_util_change.bind(this)} style={{marginLeft:"10px"}}>确定</Button>
                                </div>
                                
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                    {
                                            this.state.disk_util_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="30%"  data={i} key={k} right={(Number(k)===this.state.disk_util_data.length-1)?"0":"5%"}></Echarts>
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="网络详情" key="4">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={this.onChange.bind(this)}/>
                                    <Select style={{width:"150px",marginLeft:"10px"}} placeholder="请选择网络详情" onChange={(e)=>{this.change_select(e,"network_value")}}>
                                    {
                                        this.state.network_list.map((i,k)=>{
                                        return <Option value={i} key={k}>{i}</Option>
                                        })
                                    }
                                </Select>
                                <Button type="primary" size="small" onClick={this.network_change.bind(this)} style={{marginLeft:"10px"}}>确定</Button>
                                </div>
                                
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                    {
                                            this.state.network_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="30%"  data={i} key={k} right={(Number(k)===this.state.network_data.length-1)?"0":"5%"}></Echarts>
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>


            </div>

        )
    }
}
export default Monitor