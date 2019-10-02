import React, {Component} from 'react';
import ReactPlayer from 'react-player'
  
class Player extends Component {
    state = {
        controls: true,
        loop: true,
        pip: false,
        video_id: this.props.video_id
    }

    handleEnded = () => {
        console.log('onEnded')
    }
    
    render() {

        const video_url = 'https://www.youtube.com/watch?v=' + this.props.video_id;
        
        return (
            <>
            <ReactPlayer url={video_url}
                playing
                controls={this.state.controls}
                onEnded={this.handleEnded} 
                pip={this.state.pip}/>
            </>
        )
    }
  }

  export default Player;
