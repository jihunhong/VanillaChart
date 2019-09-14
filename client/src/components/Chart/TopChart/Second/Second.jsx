import React, {Component} from 'react';
import { MDBCol } from "mdbreact";

class Second extends Component{

    state = {
        music: '',
        chartName: this.props.chartname,
    }

    componentDidMount = () => {
        fetch(`/api/chart/${this.props.chartname}/2`)
            .then(res => res.json())
            .then(json => this.setState({music: json.data}, 
                () => console.log('2nd Data api fetched...', json)));
    }

    render(){
        const coverBackground = {
            backgroundImage: "url('https://i.ytimg.com/vi/" + this.state.music.video_id + "/maxresdefault.jpg')"
        };

        return (
            <>
                <MDBCol xl="5" className="top_music">
                    <div className="sm-logo" style={coverBackground} xl="12"></div>
                    <div className="sm-font-box">
                        <p className="top_title">{this.state.music.title}</p>
                        <p className="top_artist">{this.state.music.artist}</p>
                    </div>
                </MDBCol>
            </>
        );
    }
}

export default Second;