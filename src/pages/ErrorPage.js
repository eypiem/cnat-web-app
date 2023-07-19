import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  useEffect(() => {
    document.title = "CNAT | Page Not Found";
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 gap-3">
      <h1>404</h1>
      <p>Page does not exist.</p>
      <Link to="/" className="btn btn-outline-primary">
        Go to home page
      </Link>
    </div>
  );
}
