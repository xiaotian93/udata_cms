import React, { Component } from 'react';
import {  withRouter } from 'react-router-dom';
import List from '../templates/list';
import {Button,Input} from 'antd';
import {axios_json} from '../../ajax/request';
import {get_dashboard_base_info} from '../../ajax/api';
import {page} from '../../ajax/config';
import {arr_chunk,get_sort} from '../../ajax/tool';
import {SearchOutlined} from '@ant-design/icons';
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
            current:0,
            pageInfo:true
        };
        this.loader = [];
    }
    componentWillMount(){
        this.get_list();
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