import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import ReactPlayer from 'react-player';

class ModalPlayer extends Component {
  state = {
    modal: this.props.modal,
    idArray: this.props.idArray,
    playing: '',
    index: 0,
  };

  toggle = () => {
    this.setState({ 
      modal: !this.state.modal
    });
  }

  componentDidMount = () =>{
    
      this.setState({
        playing: this.props.idArray[this.state.index].video_id,
        title:   this.props.idArray[this.state.index].title
      });

  }

  handleEnded = () => {
    this.setState({index: this.state.index+1});
    this.setState({
      playing: this.props.idArray[this.state.index].video_id,
      title: this.props.idArray[this.state.index].title
    });
  }

  render() {

    const video_url = 'https://www.youtube.com/watch?v=' + this.state.playing;

    return (
      
        <div className="modal">
          
          <ReactPlayer url={video_url}
                playing
                controls={true}
                onEnded={this.handleEnded} />
          <MDBModalHeader toggle={this.toggle}>{this.state.title}</MDBModalHeader>
        </div>
      
    );
  }
}
export default ModalPlayer;