import React, {Component} from 'react';
import './chart.css';
import {MDBCol, MDBRow, MDBListGroup, MDBListGroupItem, MDBIcon
} from "mdbreact";
import TopChart from './TopChart/Topchart';
import Player from '../Player/Player';


class Chart extends Component {

    state = {
        chart: [],
        chartName: this.props.chartname || 'melon',
        selectedVideo: '',
        // video 아이디 값으로 구분
    };

    componentDidMount = () => {
        fetch(`/api/chart/${this.props.chartname}`)
        .then(res => res.json())
        .then(json => this.setState({chart: json.data}, /** () => console.log(`${this.props.chartname} Data api fetched...`, json) **/));
    }

    render(){

        return (
            <>
            <TopChart chartname={this.props.chartname}/>

            {this.state.selectedVideo ? <Player video_id={this.state.selectedVideo}/> : null}
            {/* 유튜브 버튼을 누르지 않을 경우 player 창을 표시하지 않음 */}
            
            <MDBCol size="12" xl="10" lg="9" md="11" sm="11" className="chart">
                <MDBRow>
                    <MDBCol size="12" xl="12" lg="12" md="12" sm="12">
                        <MDBListGroup>
                            {this.state.chart.map(v => 
                                <MDBListGroupItem key={v.rank}>
                                <span className="music_rank col-xl-1 col-lg-1 col-md-1 col-sm-1 col-1">{v.rank}</span>
                                <span className="album_img">
                                    <img src={v.img}
                                        width="58" height="58" alt={v.title}/>    
                                </span>
                                <span className="music_info   col-xl-6 col-lg-6 col-md-6 col-sm-6 col-9">
                                    <p className="music_title" >{v.title}</p>
                                    <p className="music_artist">{v.artist}</p>
                                </span>
                                <span className="music_link   offset-xl-2 offset-lg-2 offset-md-3 col-xl-1 col-lg-1 col-md-1 col-sm-1 col-1">
                                    <a className="youtube" onClick={()=>{this.setState({selectedVideo: v.video_id})}}>
                                        <MDBIcon fab icon="youtube" />
                                    </a>
                                </span>
                                <span className="add_button   col-xl-1 col-lg-1 col-md-1 col-sm-1 col-1">
                                    <a className="playlist_add">
                                        <i className="fab fa fa-share-square"></i>
                                    </a>
                                </span>
                                </MDBListGroupItem>
                            )}
                        </MDBListGroup>
                    </MDBCol>

                </MDBRow>                
            </MDBCol>

            </>
          );
    }
  
}

export default Chart;
