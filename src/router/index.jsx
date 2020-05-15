import React, { Component } from 'react';
import { Route, Redirect,Switch } from 'react-router-dom';
import Host_monitor from '../components/list/hostMonitor';
import Host_monitor_detail from '../components/detail/hostMonitor_detail';
import Nofound from '../components/notFound';
export default class CRouter extends Component {
    componentWillMount() {
        this.router_info = [
            // {
            //     path: "",
            //     components: Nofound
            // },
            {
                path: "/",
                components: Host_monitor
            },
            {
                path: "/host",
                components: Host_monitor
            },
            {
                path: "/host/detail",
                components: Host_monitor_detail
            },
        ]
    }
    render() {
        var pathname=window.location.pathname;console.log(pathname)
        return (
            <div>
                {pathname==="/"?<Redirect to="/host"></Redirect>:null}
                <Switch>
                {
                    this.router_info.map((i, k) => {
                        return <Route path={i.path} breadcrumbName="Home" exact component={i.components} key={k} />
                    })
                }
                    <Route component={Nofound} exact />
                </Switch>
            </div>

        )
    }
}