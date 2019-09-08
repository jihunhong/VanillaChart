import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Nav from './components/Nav/Nav';
import Chart from './components/Chart/Chart';
import Topchart from './components/TopChart/TopChart';


function App() {
  return (
      <Router>
        <div className="App">
        <Nav />
        <Switch>
          <Route key="melon" path="/melon" component={Chart} />
          <Route key="genie" path="/genie" component={Chart} />
          <Route key="bugs" path="/bugs" component={Chart} />
          <Route key="root" path="/" exact component={Chart} />
        </Switch>
        </div>
      </Router>
  );
}

export default App;
