import React,{ Component } from 'react';
import {Link,withRouter} from 'react-router-dom';
import {Menu} from 'antd';
// const SubMenu = Menu.SubMenu;
class SiderCustom extends Component {
    constructor(props){
        super(props);
        let keys = document.location.pathname
        let openKeys = keys.split("/").splice(0,3);
        keys = keys.split("/").splice(0,4);
        this.state = {
            collapsed:true,
            selectKeys:[keys.join('/')],
            openKeys:[openKeys.join("/")]
        };
    }
    onOpenChange(openKeys){
        if(openKeys.length>1){
            openKeys.shift();
        }
        this.setState({
            openKeys
        });
    }
    onSelect(data){
        let keys = data.key.split("/");
        let openKeys = keys.splice(0,3);
        this.setState({
            openKeys:[openKeys.join("/")]
        })
        console.log(openKeys.join("/"))
    }
    render() {
        // var data=this.props.data;
        let keys = document.location.pathname;console.log(keys.split("/"))
        keys = keys.split("/").splice(0,2).join("/");console.log(keys)
        // var heights=window.innerHeight-170;
        return (
                <Menu defaultSelectedKeys={[keys]} onOpenChange={this.onOpenChange.bind(this)} openKeys={this.state.openKeys} onSelect={this.onSelect.bind(this)} mode="inline" selectedKeys={[keys]} style={{marginTop:"10px",overflowY:"auto",overflowX:"hidden"}} theme="dark">
                        <Menu.Item key={"/host"}>
                            <Link to="/host"><span>主机监控</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/broadband"}>
                            <Link to="/broadband"><span>宽带监控</span></Link>
                        </Menu.Item>
                </Menu>
        )
    }
}

export default withRouter(SiderCustom);