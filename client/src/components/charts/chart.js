import React, {Component} from 'react';
import './chart.css';

const genie = [
    {
      "title": "안녕",
      "artist": "폴킴",
      "rank": 1,
      "video_id": "UidhQTm1ulw"
    },
    {
      "title": "기억해줘요 내 모든 날과 그때를",
      "artist": "거미 (Gummy)",
      "rank": 2,
      "video_id": "RM33KOMNsaI"
    }
]


class Chart extends Component {
    render(){
        return (
            <>
            <ul>
                {genie.map((v) => {
                    return (
                        <li key={v.rank}>{v.title}</li>
                        );
                })}
            </ul>
            </>
          );
    }
  
}

export default Chart;
