import React,{Component} from 'react';
import logo from './styls/img/logo.png';
import './styls/css/index.less';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import Side from './components/side';
import Router from './router';
import { BrowserRouter} from 'react-router-dom';
import './keep.op';
import './revision.op';

const { Content, Sider } = Layout;

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          min_height: window.innerHeight,
      };
  }
  componentWillMount () {
      this.setState({
          min_height:window.innerHeight
      })
      localStorage.setItem("select",JSON.stringify({}));
      window.onresize = () => {
          console.log('屏幕变化了');
          this.setState({
              min_height:window.innerHeight
          })
      }
      // axios_auth.get(auth_permission).then(data=>{
      //     localStorage.setItem("permissions",JSON.stringify(data.data)||"[]");
      // })

  }
  render() {
      return (
        <BrowserRouter>
          <Layout>
          <Sider style={{overflow: 'auto',height: '100vh',position: 'fixed',left: 0,}}>
            <div className="logo"><img src={logo} alt="" /></div>
            <Side />
          </Sider>
          <Layout className="site-layout" style={{ marginLeft: 200,minHeight:this.state.min_height+'px'}}>
            <Content style={{ margin: '20px', overflow: 'initial' }}>
              <Router />
            </Content>
          </Layout>
        </Layout>
        </BrowserRouter>
      );
  }
}

export default App;
