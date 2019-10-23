import React, { Component } from 'react';
import { MDBModal, MDBModalHeader, MDBIcon } from 'mdbreact';
import ReactPlayer from 'react-player';

import PlayList from './PlayList.jsx';

class AllPlayer extends Component {
  state = {
    visible: this.props.visible,
    idArray: this.props.idArray,
    playing: '',
    title: '',
    artist:'',
    index: 0,
    playlist: false
  };

  toggle = () => {
    this.setState({ 
      visible: false
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

  componentDidUpdate(prevProps, prevState){

    if(prevProps.visible !== prevState.visible){
      this.setState({visible: true});
    }
    
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


  openList = () => {
    this.setState({
      playlist: !this.state.playlist
    });
    document.querySelector(".modal").style.maxHeight = "67%";
  }

  render() {

    const video_url = 'https://www.youtube.com/watch?v=' + this.state.playing;
    const isPlaylist  = this.state.playlist ;
    
    return (
      
        <MDBModal isOpen={this.state.visible} toggle={this.toggle} backdrop={false}  size="lg"  side  position="bottom-right">
          
          <ReactPlayer url={video_url}
                playing={false}
                controls
                onEnded={this.handleEnded} />
          <MDBModalHeader toggle={this.toggle}>
            {this.state.title}

            <a className="youtube" onClick={this.openList}>
              <MDBIcon fab icon="youtube" />
            </a>

            <p className="artistName mb-0">{this.state.artist}</p>
            
            
          </MDBModalHeader>
          {isPlaylist ? 
              (<PlayList idArray={this.state.idArray} index={this.state.index} />) : null}
        </MDBModal>
      
    );
  }
}
export default AllPlayer;