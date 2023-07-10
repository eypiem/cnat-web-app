import { Link } from "react-router-dom";

import logo from "./logo.svg";
import "index.css";
import "./Home.css";

export default function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to CNAT.</p>
        <span>
          <Link to="login" className="App-link">
            Login
          </Link>
          {" or "}
          <a
            className="App-link"
            href="https://reactjs.org"
            rel="noopener noreferrer"
          >
            Register
          </a>
        </span>
        <Link to="user-area/tracker" className="App-link">
          Trackers
        </Link>
      </header>
    </div>
  );
}
