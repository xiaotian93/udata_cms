import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';
import List from '../templates/list';
import {Button,Input,Statistic} from 'antd';
import {axios_json} from '../../ajax/request';
import {get_dashboard_base_info,get_dashboard_warnings} from '../../ajax/api';
import {page} from '../../ajax/config';
import {arr_chunk,get_sort} from '../../ajax/tool';
import {SearchOutlined} from '@ant-design/icons';
class Monitor extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false,
            total:[],
            filter:{},
            pageSize:page.size,
            data:[],
            list:[],
            listPage:1,
            current:0,
            pageInfo:true,
            warnings:[],
            loading:true
        };
        this.loader = [];
    }
    componentWillMount(){
        this.get_list();
        this.get_warn();
        // this.filter={
        //     domainNo :{
        //         name: "订单编号",
        //         type: "text",
        //         placeHolder: "请输入客户名称"
        //     },
        // }
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
                },
                ...this.getColumnSearchProps('hostname'),
                
            },
            {
                title:"cpu_percent",
                dataIndex:"cpu_percent",
                sorter:(a,b)=>{
                    return get_sort(a,b,"cpu_percent")
                }
            },
            {
                title:"disk_percent",
                dataIndex:"disk_percent",
                sorter:(a,b)=>{
                    return get_sort(a,b,"disk_percent")
                }
            },
            {
                title:"disk_util",
                dataIndex:"disk_util",
                sorter:(a,b)=>{
                    return get_sort(a,b,"disk_util")
                }
            },
            {
                title:"omsa_status",
                dataIndex:"omsa_status",
                ...this.getColumnSearchProps('omsa_status'),
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
    setWarn(name,select,val){
        if(!val){
            return;
        }
        this.state.warnings.forEach(i=>{
            if(i.name!==name){
                this.setState({
                    [i.name]:false
                })
            }
        })
        if(this.state[name]){
            this.setState({
                [name]:false
            })
        }else{
            this.setState({
                [name]:true
            })
        }
        this.get_list(name,select);
    }
    get_warn(){
        axios_json.get(get_dashboard_warnings).then(e=>{
            if(!e.code){
                var arr=[];
                for(var i in e.data){
                    var json={
                        name:i,
                        value:e.data[i]
                    };
                    arr.push(json)
                }
                this.setState({
                    warnings:arr
                })
            }
        })
    }
    get_list(name,select){
        if(name){
            name=(name==="omsa_warnings"?name.replace("_warnings","_status"):name.replace("_warnings",""));
        }
        this.setState({
            loading:true
        })
        axios_json.get(get_dashboard_base_info+(name&&!select?("?warnings="+name):"")).then(e=>{
            if(!e.code){
                var data=e.data;
                var list=data.list;
                var arr=arr_chunk(list,page.size);
                this.setState({
                    data:arr,
                    pageTotal:data.total,
                    loading:false
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
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    查询
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ fontSize: "16px" }} />
            //   <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),

        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <div>{text}</div>
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0], pageInfo: false });
    };


    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '', pageInfo: true });
    }; 
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
            pagination : this.state.pageInfo?pagination:false,
            scroll:{
                x:900
            }
        }
        let table={
            filter:null,
            tableInfo:table_props,
            tableTitle:{
                left:null,
                right:null
            },
            loading:this.state.loading
        }
        return (
            <div className="card">
                <div style={{padding:"20px 20px 0 20px",overflow:"hidden"}}>
                    {this.state.warnings.map((i,k)=>{
                        return <div style={{width:"18%",marginLeft:k?"2.5%":"0",border:"1px solid #ccc",float:"left",padding:"5px"}} onClick={()=>{this.setWarn(i.name,this.state[i.name],i.value)}} className={this.state[i.name]?"select":""}><Statistic title={i.name} value={i.value} valueStyle={{color:i.value?"#cf1322":"#3f8600"}} /></div>
                    })}
                </div>
                <List {...table} />
                <style>
                    {`
                        .select{
                            box-shadow:0 2px 6px rgba(0,0,0,0.2);
                            border:1px solid #cf1322!important;
                        }
                    `}
                </style>
            </div> 
        )
    }
}
export default withRouter(Monitor)