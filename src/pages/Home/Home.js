import logo from './logo.svg';
import './Home.css';
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to CNAT.
        </p>
        <span>
        <Link to="login"className="App-link">Login</Link>
        or    
        <a
          className="App-link"
          href="https://reactjs.org"
          rel="noopener noreferrer"
        >
          Register
        </a>
        </span>
        <a
          className="App-link"
          href="/trackers"
          rel="noopener noreferrer"
        >
          Trackers
        </a>
      </header>
    </div>
  );
}

export default Home;
