import React, {Component} from 'react';
import ReactPlayer from 'react-player';
  
class AllPlayer extends Component {
    state = {
        idArray: this.props.idArray,
        playing: ''
    }

    componentDidMount = () => {
        this.setState({playing: this.props.idArray[0].video_id});
    }

    handleEnded = () => {
        this.state.idArray.shift();
        this.setState({playing: this.props.idArray[0].video_id});
    }
    
    render() {

        const video_url = 'https://www.youtube.com/watch?v=' + this.state.playing;

        return (
            <div className="player">
            <ReactPlayer url={video_url}
                playing
                controls={true}
                onEnded={this.handleEnded} />
            </div>
        )
    }
  }

  export default AllPlayer;
