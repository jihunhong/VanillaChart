import React, {Component} from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBMask
} from "mdbreact";

class First extends Component{

    state = {
        music: '',
    }

    componentDidMount(){
        fetch('/api/chart/:chart/1')
            .then(res => res.json())
            .then(json => this.setState({music: json.data}, () => console.log('1st Data api fetched...', json)));
    }

    render(){
        return (
            <>
                <MDBCol xl="7" className="top_music">
                    <div className="font-box">
                        <p className="top_title">TOPMUSIC 타이틀</p>
                        <p className="top_artist">TOPMUSIC 아티스트</p>
                    </div>
                    <div className="logo"></div>
                </MDBCol>
            </>
        );
    }
}

export default First;