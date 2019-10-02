import React, {Component} from 'react';
import { MDBRow, MDBCol } from "mdbreact";


import First from './First/First.jsx';
import Second from './Second/Second.jsx';
import Third from './Third/Third.jsx';
import AllPlayer from '../../Player/AllPlayer.jsx';

class Topchart extends Component{

    state = {
        chartname: this.props.chartname,
        chart : [],
        videoIds : ""
    }

    onClick = () =>{
        fetch(`/api/chart/${this.props.chartname}`)
            .then(res => res.json())
                .then(json => this.setState({chart: json.data}, 
                        () => this.setState({videoIds: this.appendVideoId(this.state.chart)})));
    };

    appendVideoId = (array) =>{

        const video_ids = array.map((v) => v.video_id);
        const result = video_ids.join(",");

        return result;
    }

    render(){
        return (
            <>
            
            <MDBRow>
            <MDBRow className="preview_header d-flex h-100 justify-content-center align-items-center wow fadeIn">
                <MDBCol md="10" className="mb-4 white-text text-center text-md-left">
                    <h1 className="display-4 font-weight-bold header">Today on <strong className={this.props.chartname+"_color"}> {this.props.chartname}</strong> Chart</h1>
                    <hr className="hr-light" />
                    <First chartname={this.props.chartname}/>
                    <Second chartname={this.props.chartname}/>
                    <Third chartname={this.props.chartname}/>
                    <p className="mb-4 d-none d-md-block dummy_text">
                    <strong>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </strong>
                    </p>
                    <button className="btn btn-outline-white waves-effect waves-light" onClick={this.onClick}>차트 재생
                        <i className="fab fa-youtube red-text ml-2"></i>
                    </button>
                    {/* <button className="btn btn-outline-white waves-effect waves-light">Sample Button
                        <i className="fas fa-download red-text ml-2"></i>
                    </button> */}
                </MDBCol>
            </MDBRow>
            </MDBRow>
            {this.state.videoIds === "" ? null : <AllPlayer video_id={this.state.videoIds} first={this.state.chart[0].video_id}/>}
            </>
        );
    }
}

export default Topchart;