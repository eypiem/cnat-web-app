import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const { REACT_APP_API_BASE_URL, REACT_APP_JWT_TOKEN_KEY } = process.env;

export default function UserRegisterPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [cookies, setCookie] = useCookies([REACT_APP_JWT_TOKEN_KEY]);
  const navigate = useNavigate();
  const jwt = cookies[REACT_APP_JWT_TOKEN_KEY];

  useEffect(() => {
    document.title = "CNAT | Register";
    const hasJwt = jwt !== "" && jwt != null;
    if (hasJwt) {
      navigate("/user-area/dashboard");
    }
  }, []);

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

  function register(e) {
    e.preventDefault();
    setErrorMsg("");
    setIsloading(true);

    const { firstName, lastName, email, password } = e.target.elements;
    const url = `${REACT_APP_API_BASE_URL}/users`;

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
          res.json().then((json) => {
            console.log(res);
            navigate("/login");
          });
        } else if (500 <= res.status && res.status < 600) {
          throw "Server error. Please try again later.";
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          throw "Error making request";
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg(error.message);
      })
      .finally(() => setIsloading(false));
  }
}
