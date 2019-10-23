import React, { Component } from 'react';
import { MDBListGroupItem, MDBAnimation } from 'mdbreact';

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

    return (
      <MDBAnimation className="playlist-panel" type="slideInUp">
          {this.state.idArray.map(el =>
          <MDBListGroupItem key={el.rank}>
          <p>{el.title}</p>
          </MDBListGroupItem>
          )}
      </MDBAnimation>
    );
  }
}
export default PlayList;