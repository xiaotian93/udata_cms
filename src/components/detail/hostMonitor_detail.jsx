import React, { Component } from 'react';
import TableCol from '../templates/TableCol_4';
import { Tabs,DatePicker } from 'antd';
import Echarts from '../templates/echarts';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.loader = [];
    }
    componentWillMount() {
        this.detailData = {
            name: {
                name: "实例name"
            },
            name1: {
                name: "实例ID"
            },
            name2: {
                name: "实例所属分组"
            },
            name3: {
                name: "插件状态"
            }
        }
        this.source = {
            name: "1",
            name1: "1",
            name2: "2",
            name3: "3",
        }
    }
    componentDidMount() {
    }
    onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }
      
    onOk(value) {
        console.log('onOk: ', value);
      }
    render() {
        return (
            <div className="">
                <div className="card">
                    <div className="title">实例详情</div>
                    <div className="card_content">
                        <TableCol data-source={this.source} data-columns={this.detailData} />
                    </div>
                </div>
                <div className="card">
                    <div className="card_content">
                        <Tabs type="card">
                            <TabPane tab="操作系统监控" key="1">
                                <div style={{marginBottom:"10px"}}>
                                    <span>选择时间：</span>
                                    <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={this.onChange.bind(this)} onOk={this.onOk.bind(this)} />
                                </div>
                                <div style={{marginBottom:"20px"}}>
                                    <div className="echart_title">CPU/内存/负载</div>
                                    <div style={{overflow:"hidden"}}>
                                        <Echarts title="CPU使用率" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="内存使用量" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="系统平均负载" api="" width="30%"></Echarts>
                                    </div>
                                </div>
                                <div style={{marginBottom:"20px"}}>
                                    <div className="echart_title">磁盘监控指标</div>
                                    <div style={{overflow:"hidden"}}>
                                        <Echarts title="磁盘使用率" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="读写字节数" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="读写请求数" api="" width="30%"></Echarts>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="基础监控" key="2">
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                        <Echarts title="CPU使用率" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="内存使用量" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="系统平均负载" api="" width="30%"></Echarts>
                                    </div>
                                </div>
                                <div style={{marginBottom:"20px"}}>
                                    <div style={{overflow:"hidden"}}>
                                        <Echarts title="磁盘使用率" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="读写字节数" api="" width="30%" right="5%"></Echarts>
                                        <Echarts title="读写请求数" api="" width="30%"></Echarts>
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