import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import ReactPlayer from 'react-player';

class ModalPlayer extends Component {
  state = {
    modal: this.props.modal,
    idArray: this.props.idArray,
    playing: '',
    title: '',
    artist:'',
    index: 0
  };

  toggle = () => {
    this.setState({ 
      modal: false
    });
  }

  componentDidMount = () =>{
    
    const current = this.props.idArray[this.state.index]
    
      this.setState({
        playing: current.video_id,
        title:   current.title,
        artist:  current.artist
      });

  }

  handleEnded = () => {
    this.setState({index: this.state.index+1});

    const current = this.state.idArray[this.state.index];

    this.setState({
      playing: current.video_id,
      title: current.title,
      artist: current.artist
    });
  }

  render() {

    const video_url = 'https://www.youtube.com/watch?v=' + this.state.playing;
    
    return (
      
        <MDBModal isOpen={this.state.modal} toggle={this.toggle} backdrop={false}  size="lg"  side  position="bottom-right">
          
          <ReactPlayer url={video_url}
                playing
                controls
                onEnded={this.handleEnded} />
          <MDBModalHeader toggle={this.toggle}>
            {this.state.title} 
            <artist>{this.state.artist}</artist>
          </MDBModalHeader>
        </MDBModal>
      
    );
  }
}
export default ModalPlayer;