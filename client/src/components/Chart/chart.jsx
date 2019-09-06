import React, {Component} from 'react';
import './chart.css';




class Chart extends Component {
    state = {
        chart: []
    };

    componentDidMount(){
        fetch('/api/chart/melon')
        .then(res => res.json())
        .then(json => this.setState({chart: json.data}, () => console.log('Melon Data api fetched...', json)));
    }


    render(){
        return (
            <div>
                <ul>
                    {this.state.chart.map(v => 
                        <li key={v.rank}>{v.title}</li>
                    )}
                </ul>
            </div>
          );
    }
  
}

export default Chart;
