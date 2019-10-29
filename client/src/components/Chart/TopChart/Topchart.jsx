import React, {Component} from 'react';
import { MDBRow, MDBCol } from "mdbreact";


import First from './First/First.jsx';
import Second from './Second/Second.jsx';
import Third from './Third/Third.jsx';
import AllPlayer from '../../Player/AllPlayer.jsx';
import Player from '../../Player/Player.jsx';

class Topchart extends Component{

    state = {
        chartname: this.props.chartname,
        chart : [],
        idArray : "",
        isOpen : this.props.isOpen,
        video_id: this.props.video_id,
        playlist: this.props.playlist,
        title: this.props.title,
        artist: this.props.artist
    }

    componentDidMount = () =>{
        fetch(`/api/chart/${this.props.chartname}`)
            .then(res => res.json())
                .then(json => this.setState({chart: json.data}, 
                        () => this.setState({idArray: this.state.chart})));
    };

    componentDidUpdate = (prevState, prevProps) => {
        
        if(prevProps.isOpen !== this.props.isOpen){
            this.setState({
                isOpen: this.props.isOpen
            })
        }

        if(prevState.video_id !== this.props.video_id){
            this.setState({
                video_id: this.props.video_id
            })
        }

        if(prevState.title !== this.props.title){
            this.setState({
                title: this.props.title
            })
        }

        if(prevState.artist !== this.props.artist){
            this.setState({
                artist: this.props.artist
            })
        }
    }

    onClick = () => {

        this.setState({
            isOpen : true,
            playlist: true
        })
    }

    multipleClose = (status) => {
        this.setState({
            isOpen: false,
            video_id: '',
            playlist: status
        })
    }

    singleClose = (video_id) => {
        this.setState({
            isOpen: false,
            video_id: '',
            playlist: false,
        })
    }

    play = (music) => {
        this.setState({
            isOpen: true,
            video_id: music.video_id,
            title: music.title,
            artist: music.artist
        })
    }

    render(){

        return (
            <>
            
            <MDBRow>
            <MDBRow className="preview_header d-flex h-100 justify-content-center align-items-center wow fadeIn">
                <MDBCol md="10" className="mb-4 white-text text-center text-md-left">
                    <h1 className="display-4 font-weight-bold header">Today on <strong className={this.props.chartname+"_color"}> {this.props.chartname}</strong> Chart</h1>
                    <hr className="hr-light" />
                    <First chartname={this.props.chartname}  play={this.play}/>
                    <Second chartname={this.props.chartname} play={this.play}/>
                    <Third chartname={this.props.chartname}  play={this.play}/>
                    <p className="mb-4 d-none d-md-block dummy_text">
                    <strong>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </strong>
                    </p>
                    <button className="btn btn-outline-white waves-effect waves-light" onClick={this.onClick}>차트 재생
                        <i className="fab fa-youtube red-text ml-2"></i>
                    </button>
                    
                </MDBCol>
            </MDBRow>
            </MDBRow>
            
            {this.state.isOpen && this.state.video_id && !this.state.playlist?
                (<Player _visible={true} video_id={this.state.video_id} title={this.state.title} artist={this.state.artist} singleClose={this.singleClose} />)
                :
                (null)
            }
            {this.state.isOpen && !this.state.video_id && this.state.playlist ?
                (<AllPlayer visible={this.state.isOpen} idArray={this.state.idArray} multipleClose={this.multipleClose} />)
                :
                (null)
            }
            </>
        );
    }
}

export default Topchart;