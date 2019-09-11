import React, {Component} from 'react';
import { MDBCol } from "mdbreact";

class First extends Component{

    state = {
        music: '',
        chartName: 'melon',
    }

    componentDidMount = () => {
        fetch(`/api/chart/melon/1`)
            .then(res => res.json())
            .then(json => this.setState({music: json.data}, 
                () => console.log('1st Data api fetched...', json)));
    }

    render(){
        const logoBackground = {
            backgroundImage: "url('https://i.ytimg.com/vi/" + this.state.music.video_id + "/maxresdefault.jpg')"
        };

        return (
            <>
                <MDBCol xl="7" className="top_music">
                    <div className="font-box">
                        <p className="top_title">{this.state.music.title}</p>
                        <p className="top_artist">{this.state.music.artist}</p>
                    </div>
                    <div className="logo" style={logoBackground}></div>
                    
                </MDBCol>
            </>
        );
    }
}

export default First;