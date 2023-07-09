import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import "./Login.css";

const url = "http://localhost:8080/auth/login";
const jwt_cookie = "jwt";

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);

  console.log(isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/user-area/trackers" replace={true} />;
  }

  return (
    <>
      {/* {isLoggedIn && <Navigate to="/user-area/trackers" replace={true} />} */}
      <form
        className="Login"
        onSubmit={(e) => login(e, setIsLoggedIn, setErrorMsg, setIsloading)}
      >
        <div class="input-group flex-nowrap">
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Email"
            aria-label="Email"
            aria-describedby="addon-wrapping"
          />
        </div>
        <div class="input-group flex-nowrap">
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
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : (
          <input className="btn btn-primary" type="submit" value="Login" />
        )}

        {/* <a className='Register'>Register</a> */}
      </form>
    </>
  );
}

function login(e, setIsLoggedIn, setErrorMsg, setIsloading) {
  e.preventDefault();
  setIsloading(true);
  setErrorMsg("");
  const { email, password } = e.target.elements;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
    .then((response) => {
      console.log(response.status);
      if (response.status === 200) {
        response.json().then((json) => {
          storeJWT(json);
          setIsLoggedIn(true);
        });
      } else if (400 <= response.status && response.status < 500) {
        setErrorMsg("Incorrect credentials.");
      } else if (500 <= response.status && response.status < 600) {
        setErrorMsg("Server error. Please try again later.");
      } else {
        setErrorMsg("Unexpected error code: " + response.status);
      }
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg("Unexpected error.");
    })
    .finally(() => setIsloading(false));
}

async function storeJWT(response) {
  console.log(response);
  document.cookie = `${jwt_cookie}=${response["accessToken"]}; SameSite=Strict`;
}
