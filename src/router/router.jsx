import React from 'react';
import { BrowserRouter as Router , Route } from 'react-router-dom';
import App from '../App';
// import {history} from './history';

const MyRouter = () => {
    return ( 
        <Router>
            <Route path="/" component = { App } />
        </Router>
     );
}

export default MyRouter;
