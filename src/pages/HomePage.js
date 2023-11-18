import { useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * This component represents the home page.
 *
 * @author Amir Parsa Mahdian
 */
export default function HomePage() {
  useEffect(() => {
    document.title = "CNAT | Home";
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 gap-5">
      <h1>Welcome to CNAT: Cloud-Native Asset Tracking</h1>
      <span>
        <Link to="register" className="btn btn-primary">
          Register
        </Link>
        {" or "}
        <Link to="login" className="btn btn-secondary">
          Login
        </Link>
      </span>
    </div>
  );
}
