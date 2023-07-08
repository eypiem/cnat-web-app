import React, { Component } from 'react'
import Tracker from 'components/Tracker/Tracker';
import './Trackers.css';

const url = "http://localhost:8080/tracker/get";
const jwt_cookie = "jwt";

class Trackers extends Component {
  constructor(props) {
    super(props)

    // Set initial state 
    this.state = {
      trackers: []
    }
  }

  componentDidMount() {
    var data;
    let token = this.getCookie(jwt_cookie);
    if (token === "") {
      console.error("JWT token not found");
      return;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({
          trackers: json
        });
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div className="Trackers">
        <h1>Your trackers:</h1>
        {this.state.trackers.map(item => <Tracker id = {item.id} />)}
      </div>
    );
  }

  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}

export default Trackers;