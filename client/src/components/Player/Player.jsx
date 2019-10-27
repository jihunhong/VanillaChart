import React, {Component} from 'react';
import ReactPlayer from 'react-player'
import {  MDBModal, MDBModalHeader} from 'mdbreact';
  
class Player extends Component {
    state = {
        controls: true,
        loop: true,
        visible: this.props._visible,
        title: this.props.title,
        artist: this.props.artist,
        video_id: this.props.video_id
    }

    toggle = () => {
        this.setState({ 
            visible: !this.state.visible
        });
        console.log(this.state.visible);
    }

    componentDidUpdate(prevProps, prevState){
        
        if(prevProps.video_id !== this.props.video_id){
            this.setState({
                video_id: this.props.video_id,
                title: this.props.title,
                artist: this.props.artist
            });
        }
 
        if(prevProps._visible !== prevState.visible){
            this.setState({visible: this.props._visible});
          }
    }

    
    
    render() {
        const video_url = 'https://www.youtube.com/watch?v=' + this.state.video_id;

        return (
            <MDBModal isOpen={this.state.visible} toggle={this.toggle} backdrop={false}  size="lg"  side  position="bottom-right">
            <ReactPlayer url={video_url}
                playing
                controls={true}
                />
            <MDBModalHeader toggle={this.toggle}>
            {this.state.title} 
            <p className="artistName mb-0">{this.state.artist}</p>
          </MDBModalHeader>
            </MDBModal>
        )
    }
  }

  export default Player;
