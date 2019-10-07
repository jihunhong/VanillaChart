import React, {Component} from 'react';
import ReactPlayer from 'react-player'
  
class Player extends Component {
    state = {
        controls: true,
        loop: true
    }

    handleEnded = () => {

    }
    
    render() {
        const video_url = 'https://www.youtube.com/watch?v=' + this.props.video_id;

        return (
            <div className="player">
            <ReactPlayer url={video_url}
                playing
                controls={this.state.controls}
                onEnded={this.handleEnded}/>
            </div>
        )
    }
  }

  export default Player;
