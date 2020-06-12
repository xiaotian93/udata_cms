import React, { Component } from 'react';
import { Table, Row, Modal} from 'antd';
import FilterObj from './Filter_obj8';
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setHeader:[]
        };
        this.top=10;
        this.table={}
    }
    componentWillMount() {
        this.table=this.props.tableInfo
    }
    componentDidMount() {
       
    }
    
    render() {
        document.onscroll=function(){
            var table=document.getElementsByClassName("tableInfo")[0];
            var table_fixed=document.getElementsByClassName("tablefixed")[0];
            if(!table||!table_fixed){
                return;
            }
            var height=table.getElementsByTagName("thead")[0].offsetHeight+1;
            var offtop=table.getBoundingClientRect().top;
            var width=table.offsetWidth;
             table_fixed.style.display=offtop>50?"none":"block";
             table_fixed.style.width=width+"px";
             table_fixed.style.height=height+"px";
        }
        // const table=this.props.tableInfo;
        
        // const head=this.props.tableInfo;
        // const test=head.columns;
        // for(var i in test){
        //     if(test[i].sorter){
        //         delete test[i].sorter;
        //     }
            
        // }
        // head.columns=test;
        console.log(this.props.filter)
        return (
            <div className="Component-body">
                {this.props.filter?(<FilterObj {...this.props.filter} />):null}
                <Row style={{ padding: this.props.padding?"0":"20px",width:"100%" }}>
                    <Row style={{ background: "#fff",width:"100%" }}>
                        <Row className={this.props.padding?"":"content"} style={{width:"100%"}}>
                            <div className="text-orange" style={{overflow:"hidden"}}>
                                <div style={{ float: "left",lineHeight: "28px", background: "#FFFAE5",padding:"0 5px",fontSize:"12px",color:"rgba(0,0,0,0.65)"}}>
                                    {this.props.tableTitle.left}
                                </div>
                                <div className="text-right">
                                    {this.props.tableTitle.right}
                                </div>
                            </div>
                            <Table {...this.props.tableInfo} bordered className="tableInfo" style={{width:"100%"}} loading={this.props.loading} />
                            {/* <Table {...this.props.tableInfo} bordered className="tablefixed" style={{width:"100%"}} /> */}
                        </Row>
                    </Row>
                </Row>

                <Modal {...this.props.modalInfo}>
                    {
                        this.props.modalContext
                    }
                </Modal>
    <style>{`
    .tablefixed{
        position:fixed;
        top:0px;
        overflow:hidden;
        display:none
    }
    `}</style>
            </div>
        )
    }
}

export default List;
