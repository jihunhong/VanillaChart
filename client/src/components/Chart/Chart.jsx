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
        video_id: '',
        title: '',
        artist: '',
        idArray: "",
        isOpen: false,
        playlist: false,
    };

    componentDidMount = () => {
        fetch(`/api/chart/${this.props.chartname}`)
            .then(res => res.json())
                .then(json => this.setState({chart: json}, 
                        () => this.setState({idArray: this.state.chart})));
    }

    render(){
        return (
            <>
            <TopChart chartname={this.props.chartname} 
            video_id={this.state.video_id}  
            title={this.state.title} 
            artist={this.state.artist}
            _visible={true}
            isOpen={this.state.isOpen}
            playlist={this.state.playlist}/>

            
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
                                    <a className="youtube" onClick={()=>{this.setState({
                                                                            video_id: v.video_id,
                                                                            title: v.title,
                                                                            artist: v.artist,
                                                                            isOpen: true,
                                                                            playlist: false
                                                                        })}}>
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
