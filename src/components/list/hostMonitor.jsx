import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';
import List from '../templates/list';
import {Button} from 'antd';
import {axios_json} from '../../ajax/request';
import {get_dashboard_base_info} from '../../ajax/api';
import {page} from '../../ajax/config';
import {arr_chunk} from '../../ajax/tool';
class Monitor extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modalVisible:false,
            total:[],
            filter:{},
            pageSize:page.size,
            data:[],
            list:[],
            listPage:1,
            current:0
        };
        this.loader = [];
    }
    componentWillMount(){
        this.get_list();
        this.filter={
            domainNo :{
                name: "订单编号",
                type: "text",
                placeHolder: "请输入客户名称"
            },
        }
        this.columns=[
            {
                title:"序号",
                render:(text,record,index)=>index+1
            },
            {
                title:"client_version",
                dataIndex:"client_version",
                // className:"word_set"
            },
            {
                title:"group",
                dataIndex:"group"
            },
            {
                title:"hostname",
                dataIndex:"hostname"
            },
            {
                title:"inner_ip",
                // width:200,
                dataIndex:"inner_ip",
                // className:"word_set"
                render:e=>{
                return <div style={{width:"50px",wordWrap:"break-all"}}>{e}</div>
                }
            },
            {
                title:"owner",
                dataIndex:"owner"
            },
            {
                title:"public_ip",
                dataIndex:"public_ip",
                render:e=>{
                    return <div style={{width:"50px",wordWrap:"break-all"}}>{e}</div>
                    }
            },
            {
                title:"report_time",
                dataIndex:"report_time"
            },
            {
                title:"start_time",
                dataIndex:"start_time"
            },
            {
                title:"uuid",
                dataIndex:"uuid"
            },
            {
                title:"操作",
                fixed:"right",
                width:100,
                render:e=>{
                    return <Button type="primary" size="small" onClick={this.detail.bind(this)}>监控图表</Button>
                }
            }
        ]
    }
    get_list(){
        axios_json.get(get_dashboard_base_info).then(e=>{
            if(!e.code){
                var data=e.data;
                var list=data.list;
                var arr=arr_chunk(list,page.size);
                this.setState({
                    data:arr,
                    pageTotal:data.total
                })
            }
        })
    }
    detail(){
        this.props.history.push('/host/detail');
    }
    get_filter(data){
        // let paths = this.props.location.pathname;
        // window.localStorage.setItem(paths,JSON.stringify(data))
        let filter = {};
        filter = JSON.parse(JSON.stringify(data));
        this.setState({
            filter:filter
        })
        // this.get_list(this.state.listPage,filter);
        // this.get_total(filter);
    }
    page_up(page,pageSize){
        window.scrollTo(0,0);
        console.log(page)
        this.setState({
            current:page-1
        })
    }
    showTotal(){
        return "共"+this.state.pageTotal+"条数据"
    }
    render(){
        let pagination = {
            total : this.state.pageTotal,
            current : this.state.current+1,
            pageSize : this.state.pageSize,
            showTotal:this.showTotal.bind(this),
            onChange : this.page_up.bind(this),
            showSizeChanger:false
        }
        let table_props = {
            rowKey:"hostname",
            columns:this.columns ,
            dataSource:this.state.data[this.state.current],
            pagination : pagination,
            scroll:{
                x:900
            }
        }
        let table={
            filter:{
                "data-get":this.get_filter.bind(this),
                "data-source":this.filter,
            },
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
            }
        }
        return (
            <div className="card">
                <List {...table} />
            </div> 
        )
    }
}
export default withRouter(Monitor)