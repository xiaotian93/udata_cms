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
                title:"hostname",
                // width:200,
                dataIndex:"hostname",
                // className:"word_set"
                render:e=>{
                return e
                }
            },
            {
                title:"cpu_percent",
                dataIndex:"cpu_percent",
                // className:"word_set"
            },
            {
                title:"disk_percent",
                dataIndex:"disk_percent"
            },
            {
                title:"disk_util",
                dataIndex:"disk_util"
            },
            {
                title:"omsa_status",
                dataIndex:"omsa_status"
            },
            {
                title:"report_time",
                dataIndex:"report_time"
            },
            {
                title:"操作",
                fixed:"right",
                width:100,
                render:e=>{
                    return <Button type="primary" size="small" onClick={()=>{this.detail(e.uuid)}}>监控图表</Button>
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
                window.localStorage.setItem("listDada",JSON.stringify(list));
            }
        })
    }
    detail(id){
        // this.props.history.push('/host/detail/'+id);
        window.localStorage.setItem("uuid",id);
        this.props.history.push({pathname:'/host/detail',query:{"id":id}});

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