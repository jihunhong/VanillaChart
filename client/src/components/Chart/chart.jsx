import React, {Component} from 'react';
import './chart.css';

import TopChart from './TopChart/Topchart.jsx';

class Chart extends Component {

    state = {
        chart: [],
        name: this.props.match.url.replace('/', '') || 'melon',
    };

    componentDidMount(){
        fetch(`/api/chart/${this.state.name}`)
        .then(res => res.json())
        .then(json => this.setState({chart: json.data}, () => console.log('Chart Data api fetched...', json)));
    }


    render(){
        console.log(`${this.state.name} is loaded`);
        return (
            <>
            <TopChart/>
            <div>
                <ul>
                    {this.state.chart.map(v => 
                        <li key={v.rank}>{v.title}</li>
                    )}
                </ul>
            </div>
            </>
          );
    }
  
}

export default Chart;
