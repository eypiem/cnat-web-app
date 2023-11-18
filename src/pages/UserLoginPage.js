import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import JWT_COOKIE_KEY from "constants";

/**
 * This component represents the user login page.
 *
 * @author Amir Parsa Mahdian
 */
export default function UserLoginPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [cookies, setCookie] = useCookies([JWT_COOKIE_KEY]);
  const navigate = useNavigate();
  const jwt = cookies[JWT_COOKIE_KEY];

  useEffect(() => {
    document.title = "CNAT | Login";
    const hasJwt = jwt !== "" && jwt != null;
    if (hasJwt) {
      navigate("/user-area/dashboard");
    }
  }, [jwt, navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-4 py-4 min-vh-100">
      <h3>User Login</h3>
      <form
        className="d-flex flex-column align-items-center gap-2 col-2"
        onSubmit={login}
      >
        <div className="w-100">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            aria-label="Email"
            required
          />
        </div>
        <div className="w-100">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            aria-label="Password"
            required
          />
        </div>
        {errorMsg.length > 0 && (
          <p className="text-danger text-center">{errorMsg}</p>
        )}
        {isLoading ? (
          <div className="spinner-border text-primary" role="status"></div>
        ) : (
          <input
            className="btn btn-primary w-100"
            type="submit"
            value="Login"
          />
        )}
      </form>
      <Link to="/register" className="btn btn-outline-secondary">
        Register
      </Link>
    </div>
  );

  /**
   * Sends a user authentication request from the form values and navigates to the user dashboard page if successful.
   *
   * @param e event of form containing email, and password input fields
   */
  function login(e) {
    e.preventDefault();
    setErrorMsg("");
    setIsloading(true);

    const { email, password } = e.target.elements;
    const url = `/api/users/auth`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((json) => {
            storeJWT(json);
            navigate("/user-area/dashboard");
          });
        } else if (res.status === 400) {
          res.json().then((json) => {
            if (json["validationErrors"] != null) {
              setErrorMsg(
                json["validationErrors"].map((e) => e["error"]).join(",\n")
              );
            }
          });
        } else if (res.status === 401) {
          throw new Error("Incorrect credentials");
        } else if (500 <= res.status && res.status < 600) {
          throw new Error("Server error. Please try again later.");
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          throw new Error("Error fetching data");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg(error.message);
      })
      .finally(() => setIsloading(false));
  }

  function storeJWT(response) {
    setCookie(JWT_COOKIE_KEY, response["accessToken"], {
      path: "/",
      sameSite: "strict",
    });
  }
}
