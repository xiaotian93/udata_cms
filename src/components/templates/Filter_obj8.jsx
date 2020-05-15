import React , { Component } from 'react';
import { Row , Col , DatePicker , Select , Button,Input,Checkbox } from 'antd';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker
const Option = Select.Option;

class Filter extends Component{
    constructor(props){
        super(props);
        this.state = { ...props ,isRember:false}
        this.remberDatas={}
    }
    componentDidMount(){
        // this.reset_data();
        if(this.props['data-set']){
            this.props['data-set'](this);
        }   
        let items = this.state['data-source'];
        var select=JSON.parse(window.localStorage.getItem(this.state['data-paths']));
        var get_select=select?select.remberData:{};console.log(select)
        this.setState({
            isRember:select?select.isRember:false
        })
        for(var i in get_select){
            for(let j in items){
                if(items[j].type==="range_date"||items[j].type==="range_date_day"){
                    if(get_select[items[j].feild_s]){
                        this.setState({
                            time:[moment(get_select[items[j].feild_s]),moment(get_select[items[j].feild_e])]
                        })
                    }
                    
                }else if(j==="sectionType"){
                    var arr=[];
                    if(get_select[items[j].section_s]){
                        arr.push(get_select[items[j].section_s])
                    }
                    if(get_select[items[j].section_e]){
                        arr.push(get_select[items[j].section_e])
                    }
                    console.log(arr)
                    this.setState({
                        [j]:JSON.stringify(arr)
                    })
                }else{
                    this.setState({
                [i]:get_select[i]||""
            })
                }
            }
        }
        document.addEventListener("keydown", this.onKeyDown.bind(this))
    }
    onKeyDown(e){
        if(e.keyCode===13){
            this.get_data()
        }
    }
    textChange(e){
        let key = e.target.getAttribute("id");
        this.setState({
            [key]:e.target.value
        })
    }
    selectChange(val,key){
        this.setState({
            [key]:val
        })
    }
    dateChange(date1,date2,key){
        this.setState({
            [key]:date1
        })
    }
    get_data(e){
        let items = this.state['data-source'];
        let values = {};
        for(let i in items){
            if(!this.state[i]||this.state[i].length<=0){
                continue;
            }
            if(items[i].type==="range_date"){
                values[items[i].feild_s] = this.state[i]?this.state[i][0].format("YYYY-MM-DD") + " 00:00:00":"";
                values[items[i].feild_e] = this.state[i]?this.state[i][1].format("YYYY-MM-DD") + " 23:59:59":"";
                //values[items[i].feild_s] = this.state[i]?this.state[i][0].format("YYYY-MM-DD"):"";
                //values[items[i].feild_e] = this.state[i]?this.state[i][1].format("YYYY-MM-DD"):"";
            }else if(items[i].type==="single_date"){
                values[i] = this.state[i].format("YYYY-MM-DD")||"";
            }else if(items[i].type==="range_date_day"){
                values[items[i].feild_s] = this.state[i]?this.state[i][0].format("YYYY-MM-DD"):"";
                values[items[i].feild_e] = this.state[i]?this.state[i][1].format("YYYY-MM-DD"):"";
            }else if(i==="sectionType"){
                var vals=JSON.parse(this.state[i])
                values[items[i].section_s]=vals[0]
                values[items[i].section_e]=vals[1]||""
            }else{
                values[i] = this.state[i];
            }
        }
        console.log(values)
        this.remberDatas=values;
        var pathData={};
        pathData.isRember=this.state.isRember;
        pathData.remberData=this.state.isRember?values:{};console.log(this.props["data-paths"])
        window.localStorage.setItem(this.props["data-paths"],JSON.stringify(pathData));
        this.props['data-get'](values);
    }
    reset_data(e){
        let items = this.state['data-source'];
        let null_data = {}
        for(let i in items){
            if(!items[i].default&&(!this.state[i]||this.state[i].length<=0)){
                continue;
            }
            null_data[i] = "";

            if(items[i].type==="range_date"||items[i].type==="range_date_day"){
                console.log(items[i].default)
                null_data[i] = items[i].default;
            }else if(items[i].type==="multi_select"){
                null_data[i] = [];
            }else if(items[i].type==="select"){
                if(items[i].resetValue){
                    null_data[i] = items[i].resetValue;
                }else{
                    null_data[i] = "";
                }
                
            }else{
                document.getElementById(i).value = "";
            }
        }
        this.setState(null_data)
    }
    remeber(e){
        this.setState({
            isRember:e.target.checked
        })
        // if(e.target.checked){
        var pathData={};
        pathData.isRember=e.target.checked;
        pathData.remberData=e.target.checked?this.remberDatas:{};
        window.localStorage.setItem(this.props["data-paths"],JSON.stringify(pathData));
        // }
    }
    render(){
        let items = this.state["data-source"];
        let filter_elements = [];
        for(let i in items){
            let ele = "";
            let label = (
                <Col key={i+"key"} className="element-name">
                    {items[i].name}
                </Col>
            )
            if(items[i].type==="range_date"||items[i].type==="range_date_day"){
                ele = (
                    <Col key={i} className="element">
                        <RangePicker value={this.state[i]} className={i} placeholder={["开始时间","结束时间"]} onChange={(date,str)=>{ this.dateChange(date,str,i) }} />
                    </Col>)
            }else if(items[i].type==="text"){
                // console.log(this.state[i])
                ele = (
                    <Col key={i} className="element">
                        <Input id={i} onChange={this.textChange.bind(this)} type="text" className="ipt-text" placeholder={"请输入"+items[i].name} value={this.state[i]} />
                    </Col>)
            }else if(items[i].type==="select"){
                let values = items[i].values;
                values = typeof values==="string"?this.props[values]:values;
                let opt_ele = [<Option key={100} value={items[i].defaultValue?items[i].defaultValue:""}>全部</Option>];
                for(let v in values){
                    if(values[v].name!=="全部"){
                        opt_ele.push(<Option key={v} value={values[v].val+""}>{values[v].name}</Option>)
                    }
                }
                let select = (<Select dropdownMatchSelectWidth={false} dropdownMenuStyle={{width:"auto"}} value={this.state[i]||""} id={i} placeholder={items[i].placeHolder} onChange={(val)=>{ this.selectChange(val,i)}}>{opt_ele}</Select>);
                ele = (
                    <Col key={i} className="element">
                        {select}
                    </Col>)
            }else if(items[i].type==="multi_select"){
                let val_key = items[i].values;
                let ops = this.state[val_key];
                let opt_ele = [];
                for(let o in ops){
                    if(ops[o].name!=="全部"){
                        opt_ele.push(<Option key={ops[o].val}>{ops[o].name}</Option>)
                    }
                }
                ele = (
                    <Col key={i} className="element">
                        <Select dropdownMatchSelectWidth={false} dropdownMenuStyle={{width:"auto"}} key={i} value={this.state[i]} mode="multiple" placeholder={"请选择"+items[i].name} onChange={(val)=>{ this.selectChange(val,i)}}>
                            {opt_ele}
                        </Select>
                    </Col>
                )
            }
            var divs=(
                <div className="item" key={i}>{label}{ele}</div>
            )
            filter_elements.push(divs);
        }
        return (
            <Row className="filter-bar filter" style={{display:this.props.hidden?"none":"block"}}>
                <Row className="items">
                {filter_elements}
                <div className="item">
                {this.props["data-paths"]?<Checkbox onChange={this.remeber.bind(this)} checked={this.state.isRember}>记住</Checkbox>:null}
                <Button type="primary" onClick={this.get_data.bind(this)}>查询</Button>&emsp;
                <Button onClick={this.reset_data.bind(this)}>重置</Button>
                </div>
                
                </Row>
                {/* <Row style={{textAlign:"right",marginTop:"10px"}}>
                    <Button type="primary" onClick={this.get_data.bind(this)}>查询</Button>&emsp;
                    <Button onClick={this.reset_data.bind(this)}>重置</Button>
                </Row> */}
            </Row>
        )
    }
}

export default Filter;