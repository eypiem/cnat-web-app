import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";

const url = "http://localhost:8080/auth/login";
const jwt_cookie = "jwt";

export default function UserLoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);

  console.log(`Login: is logged in: ${isLoggedIn || hasJWT()}`);

  return (
    <>
      {(isLoggedIn || hasJWT()) && (
        <Navigate to="/user-area/tracker" replace={true} />
      )}
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 gap-3">
        <h3>User Login</h3>
        <form
          className="d-flex flex-column align-items-center gap-3"
          onSubmit={(e) => login(e, setIsLoggedIn, setErrorMsg, setIsloading)}
        >
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
            <input className="btn btn-primary" type="submit" value="Login" />
          )}
        </form>
        <Link to="/register" className="btn btn-outline-secondary">
          Register
        </Link>
      </div>
    </>
  );
}

function login(e, setIsLoggedIn, setErrorMsg, setIsloading) {
  e.preventDefault();
  setErrorMsg("");
  setIsloading(true);
  const { email, password } = e.target.elements;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
    .then((res) => {
      if (res.status === 200) {
        res.json().then((json) => {
          storeJWT(json);
          setIsLoggedIn(true);
        });
      } else if (400 <= res.status && res.status < 500) {
        setErrorMsg("Incorrect credentials.");
      } else if (500 <= res.status && res.status < 600) {
        setErrorMsg("Server error. Please try again later.");
      } else {
        console.error(`Unexpected error code: ${res.status}`);
        setErrorMsg("Error fetching data.");
      }
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg("Error fetching data.");
    })
    .finally(() => setIsloading(false));
}

async function storeJWT(response) {
  document.cookie = `${jwt_cookie}=${response["accessToken"]}; SameSite=Strict`;
}

function hasJWT() {
  const jwt = getCookie(jwt_cookie);
  const hasJWT = jwt !== "" && jwt != null;
  console.log(hasJWT ? "Found JWT in cookies" : "No JWT stored in cookies");
  return hasJWT;
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}