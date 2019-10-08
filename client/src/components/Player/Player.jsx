import React, {Component} from 'react';
import ReactPlayer from 'react-player'
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
  
class Player extends Component {
    state = {
        controls: true,
        loop: true,
        modal: this.props.modal
    }

    handleEnded = () => {

    }
    
    render() {
        const video_url = 'https://www.youtube.com/watch?v=' + this.props.video_id;

        return (
            <MDBModal isOpen={this.state.modal} toggle={this.toggle} backdrop={false}  size="lg"  side  position="bottom-right">
            <ReactPlayer url={video_url}
                playing
                controls={true}
                onEnded={this.handleEnded} />
            <MDBModalHeader toggle={this.toggle}>{this.state.title}</MDBModalHeader>
            </MDBModal>
        )
    }
  }

  export default Player;
