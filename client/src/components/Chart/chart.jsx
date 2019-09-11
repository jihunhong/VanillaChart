import React, {Component} from 'react';
import './chart.css';

import TopChart from './TopChart/Topchart';

class Chart extends Component {

    state = {
        chart: [],
        chartName: this.props.chartname || 'melon',
    };

    componentDidMount = () => {
        fetch(`/api/chart/${this.props.chartname}`)
        .then(res => res.json())
        .then(json => this.setState({chart: json.data}, () => console.log(`${this.props.chartname} Data api fetched...`, json)));
    }


    render(){
        return (
            <>
            <TopChart chartname={this.props.chartname}/>
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
