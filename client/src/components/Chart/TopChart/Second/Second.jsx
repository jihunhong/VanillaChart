import React, {Component} from 'react';
import { MDBCol } from "mdbreact";

class Second extends Component{

    state = {
        music: '',
        chartName: this.props.chartname,
        imageOpt: 'maxresdefault',
    }

    async componentDidMount() {

        const res = await fetch(`/api/chart/${this.props.chartname}/2`);
        const json = await res.json();
        
        
        this.setState({
            music : json
        });
        try{
            await fetch(`https://i.ytimg.com/vi/${this.state.music.video_id}/${this.state.imageOpt}.jpg`);
        }catch(e){
            this.setState({
                imageOpt : 'hqdefault'
            })
        }
        
    }

    play = () => {
        this.props.play(this.state.music)
    }

    render(){
        const coverBackground = {
            backgroundImage: `url('https://i.ytimg.com/vi/${this.state.music.video_id}/${this.state.imageOpt}.jpg')`
        };

        return (
            <>
                <MDBCol size="0" xl="5" className="top_music second">
                    <div className="sm-logo" style={coverBackground} xl="12"></div>
                    <div className="sm-font-box" onClick={this.play}>
                        <p className="top_title">{this.state.music.title}</p>
                        <p className="top_artist">{this.state.music.artist}</p>
                    </div>
                </MDBCol>
            </>
        );
    }
}

export default Second;