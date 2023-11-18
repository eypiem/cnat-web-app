import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import JWT_COOKIE_KEY from "constants";

/**
 * This component represents the user registration page.
 *
 * @author Amir Parsa Mahdian
 */
export default function UserRegisterPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [cookies] = useCookies([JWT_COOKIE_KEY]);
  const navigate = useNavigate();
  const jwt = cookies[JWT_COOKIE_KEY];

  useEffect(() => {
    document.title = "CNAT | Register";
    const hasJwt = jwt !== "" && jwt != null;
    if (hasJwt) {
      navigate("/user-area/dashboard");
    }
  }, [jwt, navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 py-4 gap-4">
      <h3>User Registration</h3>
      <form
        className="d-flex flex-column align-items-center gap-2 col-2"
        onSubmit={register}
      >
        <div className="w-100">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            className="form-control"
            aria-label="First Name"
            required
          />
        </div>
        <div className="w-100">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            className="form-control"
            aria-label="Last Name"
            required
          />
        </div>
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
            value="Register"
          />
        )}
      </form>
      <Link to="/login" className="btn btn-outline-secondary">
        Login
      </Link>
    </div>
  );

  /**
   * Sends a user register request from the form values and navigates to the login page if successful.
   *
   * @param e event of form containing firstName, lastName, email, and password input fields
   */
  function register(e) {
    e.preventDefault();
    setErrorMsg("");
    setIsloading(true);

    const { firstName, lastName, email, password } = e.target.elements;
    const url = `/api/users`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then((res) => {
        if (res.ok) {
          navigate("/login");
        } else if (res.status === 400) {
          res.json().then((json) => {
            if (json["validationErrors"] != null) {
              setErrorMsg(
                json["validationErrors"].map((e) => e["error"]).join(",\n")
              );
            }
          });
        } else if (500 <= res.status && res.status < 600) {
          throw new Error("Server error. Please try again later.");
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          throw new Error("Error making request");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg(error.message);
      })
      .finally(() => setIsloading(false));
  }
}
