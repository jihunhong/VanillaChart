import React, { Component } from 'react';
import { MDBListGroup, MDBListGroupItem, MDBAnimation } from 'mdbreact';

class PlayList extends Component {
  state = {
    idArray: this.props.idArray,
    index: this.props.index,
    playlist: false
  };

  componentDidMount(prevProps, prevState){
    console.log(this.state.idArray);
  }

  render() {
    const thumbnail = 'https://i.ytimg.com/vi/';
    const imgQuaility = '/default.jpg';

    return (
      <MDBAnimation className="playlist-panel" type="slideInUp">
        <MDBListGroup>
          {this.state.idArray.map(el =>
          <MDBListGroupItem key={el.rank}>
            <span className="thumbnails"><img src={thumbnail + el.video_id + imgQuaility} /></span>
            <span className="music_info col-xl-6 col-lg-6 col-md-6 col-sm-6 col-9"><p className="music_title">{el.title}</p></span>
          </MDBListGroupItem>
          )}
        </MDBListGroup>
      </MDBAnimation>
    );
  }
}
export default PlayList;