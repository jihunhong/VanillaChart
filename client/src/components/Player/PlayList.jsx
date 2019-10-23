import React, { Component } from 'react';

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
      <div>

      </div>
    );
  }
}
export default PlayList;