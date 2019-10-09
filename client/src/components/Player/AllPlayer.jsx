import React, { Component } from 'react';
import { MDBModal, MDBModalHeader} from 'mdbreact';
import ReactPlayer from 'react-player';

class AllPlayer extends Component {
  state = {
    visible: this.props.visible,
    idArray: this.props.idArray,
    playing: '',
    title: '',
    artist:'',
    index: 0
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

  render() {

    const video_url = 'https://www.youtube.com/watch?v=' + this.state.playing;
    
    return (
      
        <MDBModal isOpen={this.state.visible} toggle={this.toggle} backdrop={false}  size="lg"  side  position="bottom-right">
          
          <ReactPlayer url={video_url}
                playing
                controls
                onEnded={this.handleEnded} />
          <MDBModalHeader toggle={this.toggle}>
            {this.state.title} 
            <p className="artistName mb-0">{this.state.artist}</p>
          </MDBModalHeader>
        </MDBModal>
      
    );
  }
}
export default AllPlayer;