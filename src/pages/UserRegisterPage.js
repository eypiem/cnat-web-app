import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";

const url = "http://localhost:8080/user/register";

export default function UserRegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);

  return (
    <>
      {isRegistered && <Navigate to="/login" replace={true} />}
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 gap-3">
        <h3>User Registration</h3>
        <form
          className="d-flex flex-column align-items-center gap-3"
          onSubmit={(e) =>
            register(e, setIsRegistered, setErrorMsg, setIsloading)
          }
        >
          <div className="input-group flex-nowrap">
            <input
              id="firstName"
              type="text"
              className="form-control"
              placeholder="First Name"
              aria-label="First Name"
              aria-describedby="addon-wrapping"
            />
          </div>
          <div className="input-group flex-nowrap">
            <input
              id="lastName"
              type="text"
              className="form-control"
              placeholder="Last Name"
              aria-label="Last Name"
              aria-describedby="addon-wrapping"
            />
          </div>
          <div className="input-group flex-nowrap">
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Email"
              aria-label="Email"
              aria-describedby="addon-wrapping"
            />
          </div>
          <div className="input-group flex-nowrap">
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Password"
              aria-label="Password"
              aria-describedby="addon-wrapping"
            />
          </div>
          {errorMsg.length > 0 && <p className="text-danger">{errorMsg}</p>}
          {isLoading ? (
            <div className="spinner-border text-primary" role="status"></div>
          ) : (
            <input className="btn btn-primary" type="submit" value="Register" />
          )}
        </form>
        <Link to="/login" className="btn btn-outline-secondary">
          Login
        </Link>
      </div>
    </>
  );
}

function register(e, setIsLoggedIn, setErrorMsg, setIsloading) {
  e.preventDefault();
  setErrorMsg("");
  setIsloading(true);
  const { firstName, lastName, email, password } = e.target.elements;

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
      if (res.status === 200) {
        res.json().then((json) => {
          console.log(res);
          setIsLoggedIn(true);
        });
      } else if (500 <= res.status && res.status < 600) {
        setErrorMsg("Server error. Please try again later.");
      } else {
        console.error(`Unexpected error code: ${res.status}`);
        setErrorMsg("Error making request.");
      }
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg("Error making request.");
    })
    .finally(() => setIsloading(false));
}
