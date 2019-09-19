import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Nav from './components/Nav/Nav.jsx';
import Chart from './components/Chart/Chart.jsx';
import Player from './components/Player/Player.jsx';


function App() {

    return (
        <Router>
          <div className="App">
          <Nav />
          <Switch>
            <Route key="melon" path="/melon"  render={props => <Chart chartname="melon"/>} />
            <Route key="genie" path="/genie"  render={props => <Chart chartname="genie"/>} />
            <Route key="bugs" path="/bugs"    render={props => <Chart chartname="bugs"/>} />
            <Route key="root" path="/" exact  render={props => <Chart chartname="melon"/>} />
          </Switch>
          </div>
          <Player />
        </Router>
        
    );
}

export default App;
