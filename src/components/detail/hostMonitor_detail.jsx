import React, { Component } from 'react';
import TableCol from '../templates/TableCol_4';
import { Tabs,DatePicker,Select,Button,Spin } from 'antd';
import Echarts from '../templates/echarts';
import {axios_json} from '../../ajax/request';
import moment from 'moment';
import {get_base_info,get_cpu_info,get_mem_info,get_disk_list,get_disk_info,get_disk_util_list,get_disk_util_info,get_network_interface_list,get_network_info,get_connections_info,get_pids_info} from '../../ajax/api';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{},
            // uuid:window.localStorage.getItem("uuid"),
            cpu_data:[],
            mem_data:[],
            disk_list:[],
            disk_data:[{legend:""}],
            startTime:moment().subtract(1,"days").format("YYYY-MM-DD")+ " 00:00:00",
            endTime:moment().subtract(0,"days").format("YYYY-MM-DD HH:mm")+ ":00",
            disk_util_data:[{legend:""}],
            disk_util_list:[],
            network_list:[],
            network_data:[{legend:""}],
            connections_list:[],
            connections_data:[],
            pids_data:[],
            defaultTime:[moment(moment().subtract(1,"days").format("YYYY-MM-DD")+" 00:00"),moment()],
            uuid:props.location.state.id
        };
        this.loader = [];
        // this.defaultTime=[moment(moment().subtract(1,"days").format("YYYY-MM-DD")+" 00:00"),moment()]
    }
    componentWillMount() {
        console.log(this.props.location.state)
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
        this.get_runing(this.state.uuid)
    }
    get_runing(uuid){
        this.get_detail(uuid);
        this.get_cpu(uuid,get_cpu_info,"cpu_data");
        this.get_cpu(uuid,get_mem_info,"mem_data");
        // this.get_cpu(uuid,get_disk_info,"disk_data");
        // this.get_cpu(uuid,get_disk_util_info,"disk_util_data");
        // this.get_cpu(uuid,get_network_info,"network_data");
        this.get_cpu(uuid,get_connections_info,"connections_data");
        this.get_cpu(uuid,get_pids_info,"pids_data");
        this.get_select(uuid);

    }
    get_select(uuid){
        axios_json.get(get_disk_list+"?uuid="+(uuid||this.state.uuid)).then(e=>{
            var data=e.data;
            this.disk_change(data[0]);
            this.setState({
                disk_list:data,
                disk_value:data[0]
            })
        })
        axios_json.get(get_disk_util_list+"?uuid="+(uuid||this.state.uuid)).then(e=>{
            var data=e.data;
            this.disk_util_change(data[0])
            this.setState({
                disk_util_list:data,
                disk_util_value:data[0]
            })
        })
        axios_json.get(get_network_interface_list+"?uuid="+(uuid||this.state.uuid)).then(e=>{
            var data=e.data;
            this.network_change(data[0])
            this.setState({
                network_list:data,
                network_value:data[0]
            })
        })
    }
    get_detail(uuid){
        axios_json.get(get_base_info+"?uuid="+(uuid||this.state.uuid)).then(e=>{
            var detail=e.data;
            delete detail.uuid;
            this.setState({
                data:detail
            })
        })
    }
    get_cpu(uuid,api,status,start,end,disk){
        this.setState({
            spin:true
        })
        axios_json.get(api+"?uuid="+(uuid||this.state.uuid)+"&start="+(start||this.state.startTime)+"&end="+(end||this.state.endTime)+(disk?("&"+disk.name+"="+disk.value):"")).then(e=>{
            var data=e.data,dataX=[],cpu_data=[];
            for(var k in data[0].data){
                dataX.push(data[0].data[k][0])
            }
            if(data.length<1){
                cpu_data.push({uuid:uuid||this.state.uuid});
                this.setState({
                    [status]:cpu_data,
                    spin:false
                })
                return;
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
                    dataX:dataX,
                    legend:data[i].name,
                    api:api,
                    startTime:start||this.state.startTime,
                    endTime:end||this.state.endTime,
                    uuid:uuid||this.state.uuid
                }
                }
                cpu_data.push(cpu_json);
            }           
            this.setState({
                [status]:cpu_data,
                spin:false
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
            endTime:end,
            defaultTime:value
        })
      }
      disk_change(disk_value){
        this.setState({
            disk_data:[],
        })
        this.get_cpu(this.state.uuid,get_disk_info,"disk_data",this.state.startTime,this.state.endTime,{name:"device",value:disk_value||""});
      }
      cpu_change(){
        this.setState({
            cpu_data:[],
            // mem_data:[]
        })
        this.get_cpu(this.state.uuid,get_cpu_info,"cpu_data",this.state.startTime,this.state.endTime);
        // this.get_cpu(get_mem_info,"mem_data",this.state.startTime,this.state.endTime);
      }
      men_change(){
        this.setState({
            mem_data:[]
        })
        this.get_cpu(this.state.uuid,get_mem_info,"mem_data",this.state.startTime,this.state.endTime);
      }
      change_select(value,name){
          console.log(value)
          this.setState({
              [name]:value
          })
      }
      disk_util_change(disk_util_value){
        this.setState({
            disk_util_data:[],
        })
        this.get_cpu(this.state.uuid,get_disk_util_info,"disk_util_data",this.state.startTime,this.state.endTime,{name:"device",value:disk_util_value||""});
      }
      network_change(network_value){
        this.setState({
            network_data:[],
        })
        this.get_cpu(this.state.uuid,get_network_info,"network_data",this.state.startTime,this.state.endTime,{name:"interface",value:network_value||""});
      }
      pids_change(){
        this.setState({
            pids_data:[],
        })
        this.get_cpu(get_pids_info,"pids_data",this.state.startTime,this.state.endTime);
      }
      connections_change(){
        this.setState({
            connections_data:[],
        })
        this.get_cpu(this.state.uuid,get_connections_info,"connections_data",this.state.startTime,this.state.endTime);
      }
      //host change
      hostChange(value){
        this.setState({
            uuid:value
        })
        this.get_detail(value);
        this.get_cpu(value,get_cpu_info,"cpu_data");
        this.get_cpu(value,get_mem_info,"mem_data");
        // this.get_cpu(value,get_disk_info,"disk_data");
        this.get_cpu(value,get_disk_info,"disk_data",this.state.startTime,this.state.endTime,{name:"device",value:this.state.disk_value||""});
        // this.get_cpu(value,get_disk_util_info,"disk_util_data");
        this.get_cpu(value,get_disk_util_info,"disk_util_data",this.state.startTime,this.state.endTime,{name:"device",value:this.state.disk_util_value||""});
        // this.get_cpu(value,get_network_info,"network_data");
        this.get_cpu(value,get_network_info,"network_data",this.state.startTime,this.state.endTime,{name:"interface",value:this.state.network_value||""});
        this.get_cpu(value,get_connections_info,"connections_data");
        this.get_cpu(value,get_pids_info,"pids_data");
      }
    render() {
        const listDada=JSON.parse(window.localStorage.getItem("listDada"))||[],selectData=[];
        listDada.forEach(item=>{
            selectData.push({name:item.hostname,value:item.uuid})
        })
        const RangePickerInfo={
            showTime:{ format: 'HH:mm' ,defaultValue:[moment('00:00', 'HH:mm'),moment('23:59', 'HH:mm')]},
            format:"YYYY-MM-DD HH:mm",
            onChange:this.onChange.bind(this),
            value:this.state.defaultTime
        }
        const selectHost=<div><span>hostname：</span><Select style={{width:180}} value={this.state.uuid} onChange={this.hostChange.bind(this)}>
            {
                listDada.map(item=>{
                    return <Option value={item.uuid}>{item.hostname}</Option>
                })
            }
        </Select></div>
        // console.log(this.state.cpu_data,this.state.uuid)
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
                        <Spin spinning={this.state.spin} >
                        <Tabs type="card" tabBarExtraContent={selectHost}>
                            <TabPane tab="CPU状态" key="1">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker {...RangePickerInfo} />
                                    <Button type="primary" size="small" onClick={this.cpu_change.bind(this)} style={{marginLeft:"10px"}}>确定</Button>
                                </div>
                                <div style={{marginBottom:"20px"}}>
                                    {/* <div className="echart_title">CPU状态</div> */}
                                    <div style={{overflow:"hidden"}}>
                                        {
                                            this.state.cpu_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="45%"  data={i} key={k} right={(Number(k)===this.state.cpu_data.length-1)?"0":"5%"} text={i.legend} />
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="内存信息" key="7">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker {...RangePickerInfo} />
                                    <Button type="primary" size="small" onClick={this.men_change.bind(this)} style={{marginLeft:"10px"}}>确定</Button>
                                </div>
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                        {
                                            this.state.mem_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="45%"  data={i} key={k} right={(Number(k)===this.state.mem_data.length-1)?"0":"5%"} text={i.legend} />
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="磁盘状态" key="2">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker {...RangePickerInfo} />
                                    <Select style={{width:"150px",marginLeft:"10px"}} placeholder="请选择磁盘" onChange={(e)=>{this.change_select(e,"disk_value")}} value={this.state.disk_value}>
                                    {
                                        this.state.disk_list.map((i,k)=>{
                                        return <Option value={i} key={k}>{i}</Option>
                                        })
                                    }
                                </Select>
                                <Button type="primary" size="small" onClick={()=>{this.disk_change(this.state.disk_value)}} style={{marginLeft:"10px"}}>确定</Button>
                                </div>
                                
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                    {
                                            this.state.disk_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="45%"  data={i} key={k} right={(Number(k)===this.state.disk_data.length-1)?"0":"5%"} text={i?i.legend:""} />
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="磁盘负载详情" key="3">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker {...RangePickerInfo} />
                                    <Select style={{width:"150px",marginLeft:"10px"}} placeholder="请选择磁盘负载" onChange={(e)=>{this.change_select(e,"disk_util_value")}} value={this.state.disk_util_value}>
                                    {
                                        this.state.disk_util_list.map((i,k)=>{
                                        return <Option value={i} key={k}>{i}</Option>
                                        })
                                    }
                                </Select>
                                <Button type="primary" size="small" onClick={()=>{this.disk_util_change(this.state.disk_util_value)}} style={{marginLeft:"10px"}}>确定</Button>
                                </div>
                                
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                    {
                                            this.state.disk_util_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="45%"  data={i} key={k} right={(Number(k)===this.state.disk_util_data.length-1)?"0":"5%"} text={i?i.legend:""} />
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="网络详情" key="4">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker {...RangePickerInfo} />
                                    <Select style={{width:"150px",marginLeft:"10px"}} placeholder="请选择网络详情" onChange={(e)=>{this.change_select(e,"network_value")}} value={this.state.network_value}>
                                    {
                                        this.state.network_list.map((i,k)=>{
                                        return <Option value={i} key={k}>{i}</Option>
                                        })
                                    }
                                </Select>
                                <Button type="primary" size="small" onClick={()=>{this.network_change(this.state.network_value)}} style={{marginLeft:"10px"}}>确定</Button>
                                </div>                               
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                    {
                                            this.state.network_data.map((i,k)=>{
                                                return <Echarts title="CPU使用率" api="" width="45%"  data={i} key={k} right={(Number(k)===this.state.network_data.length-1)?"0":"5%"} text={i?i.legend:""} />
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="连接数" key="5">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker {...RangePickerInfo} />
                                    <Button type="primary" size="small" onClick={()=>{this.connections_change(this.state.network_value)}} style={{marginLeft:"10px"}}>确定</Button>
                                </div>                               
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                    {
                                            this.state.connections_data.map((i,k)=>{
                                                return <Echarts title="连接数" api="" width="45%"  data={i} key={k} right={(Number(k)===this.state.connections_data.length-1)?"0":"5%"} text={i?i.legend:""} />
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="进程数" key="6">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker {...RangePickerInfo} />
                                    <Button type="primary" size="small" onClick={()=>{this.pids_change(this.state.network_value)}} style={{marginLeft:"10px"}}>确定</Button>
                                </div>                               
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                    {
                                            this.state.pids_data.map((i,k)=>{
                                                return <Echarts title="连接数" api="" width="45%"  data={i} key={k} right={(Number(k)===this.state.pids_data.length-1)?"0":"5%"} text={i?i.legend:""} />
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                        </Spin>
                    </div>
                </div>


            </div>

        )
    }
}
export default Monitor