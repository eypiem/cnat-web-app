import React, { Component } from 'react'

import './Tracker.css';

class Tracker extends React.Component {

  render() {
    return (
      <div className="Tracker">
        <h5>{this.props.id}</h5>
      </div>
    );
  }

}

// function Tracker() {
//   return (
//     <div className="Tracker">
//       <h5>{this.props.id}</h5>
//     </div>
//   );
// }

export default Tracker;