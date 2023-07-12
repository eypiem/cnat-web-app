import React from "react";
import { Link, Outlet } from "react-router-dom";
import UserLoginPage from "pages/UserLoginPage";

const jwt_cookie = "jwt";

export default function UserAreaLayout() {
  const token = getCookie(jwt_cookie);
  console.log(`UserAreaLayout: is logged in: ${hasJWT()}`);

  return hasJWT() ? (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            CNAT
          </Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/user-area/tracker"
                  className="nav-link active"
                  aria-current="page"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link active" aria-current="page">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet context={{ token: token }} />
    </>
  ) : (
    <UserLoginPage />
  );
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
