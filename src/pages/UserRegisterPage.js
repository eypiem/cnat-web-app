import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";

const { REACT_APP_API_BASE_URL } = process.env;

export default function UserRegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);

  return (
    <>
      {isRegistered && <Navigate to="/login" replace={true} />}
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 gap-4">
        <h3>User Registration</h3>
        <form
          className="d-flex flex-column align-items-center gap-2"
          onSubmit={register}
        >
          <div>
            <label htmlFor="from" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="form-control"
              aria-label="First Name"
              aria-describedby="addon-wrapping"
            />
          </div>
          <div>
            <label htmlFor="from" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="form-control"
              aria-label="Last Name"
              aria-describedby="addon-wrapping"
            />
          </div>
          <div>
            <label htmlFor="from" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              aria-label="Email"
              aria-describedby="addon-wrapping"
            />
          </div>
          <div>
            <label htmlFor="from" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              aria-label="Password"
              aria-describedby="addon-wrapping"
            />
          </div>
          {errorMsg.length > 0 && <p className="text-danger">{errorMsg}</p>}
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
    </>
  );

  function register(e) {
    e.preventDefault();
    setErrorMsg("");
    setIsloading(true);

    const { firstName, lastName, email, password } = e.target.elements;
    const url = `${REACT_APP_API_BASE_URL}/user/register`;

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
            setIsRegistered(true);
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
}
