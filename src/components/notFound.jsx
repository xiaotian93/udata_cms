import React, { Component } from 'react';
import Nofound from '../styls/img/404.png';
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
    }
    componentDidMount() {
       
    }
    
    render() {
        var height=window.innerHeight-100
        return (
            <div className="Component-body" style={{height:height,paddingTop:(height-50)/2+"px"}}>
                <img src={Nofound} alt="" />
                <div>页面跑丢了。。。</div>
    <style>{`
    .Component-body{
        text-align:center
    }
    .Component-body>img{
        height:50px;
    }
    .Component-body>div{
        font-size:16px;
        margin-top:10px;
    }
    `}</style>
            </div>
        )
    }
}

export default List;
