import React, {Component} from 'react';
import { MDBCol } from "mdbreact";

class First extends Component{

    state = {
        music: '',
        chartName: this.props.chartname,
        imageOpt: 'maxresdefault',
    }

    async componentDidMount() {

        const res = await fetch(`/api/chart/${this.props.chartname}/1`);
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
                <MDBCol xl="7" className="top_music first">
                    <div className="font-box" onClick={this.play}>
                        <p className="top_title">{this.state.music.title}</p>
                        <p className="top_artist">{this.state.music.artist}</p>
                    </div>
                    <div className="logo" style={coverBackground}></div>
                </MDBCol>
            </>
        );
    }
}

export default First;