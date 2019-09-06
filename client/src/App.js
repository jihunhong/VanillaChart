import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Navbar from './components/Nav/navbar';
import Chart from './components/Chart/chart';
import Topchart from './components/TopChart/topchart';


function App() {
  return (
    <div className="App">
      
      <Navbar />
      <Topchart />
      <Chart />
    </div>
  );
}

export default App;
