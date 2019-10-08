import React, {Component} from 'react';
import ReactPlayer from 'react-player'
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
  
class Player extends Component {
    state = {
        controls: true,
        loop: true,
        modal: this.props.modal,
        title: this.props.title,
        artist: this.props.artist
    }

    toggle = () => {
        this.setState({ 
          modal: !this.state.modal
        });
    }

    
    
    render() {
        const video_url = 'https://www.youtube.com/watch?v=' + this.props.video_id;

        return (
            <MDBModal isOpen={this.state.modal} toggle={this.toggle} backdrop={false}  size="lg"  side  position="bottom-right">
            <ReactPlayer url={video_url}
                playing
                controls={true}
                />
            <MDBModalHeader toggle={this.toggle}>
            {this.state.title} 
            <artist>{this.state.artist}</artist>
          </MDBModalHeader>
            </MDBModal>
        )
    }
  }

  export default Player;
