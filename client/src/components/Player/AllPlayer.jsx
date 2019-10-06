import React, {Component} from 'react';
  
class AllPlayer extends Component {
    state = {
        first : this.props.first,
        video_id: this.props.video_id
    }

    handleEnded = () => {
        console.log('onEnded')
    }
    
    
    render() {
        const src = `http://www.youtube.com/embed/${this.state.first}?playlist=${this.state.video_id}`;
        
        return (
            <div className="player">
                <iframe title="Embeds Page" className="youtube-player" type="text/html" width="640" height="385" 
                    src={src} frameBorder="0" allowFullScreen>
                </iframe>
            </div>
        )
    }
  }

  export default AllPlayer;
