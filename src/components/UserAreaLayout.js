import React from "react";
import { Link, Outlet } from "react-router-dom";
import UserLoginPage from "pages/UserLoginPage";
import { useCookies } from "react-cookie";

const { REACT_APP_JWT_TOKEN_KEY } = process.env;

export default function UserAreaLayout() {
  const [cookies, setCookie, removeCookie] = useCookies([
    REACT_APP_JWT_TOKEN_KEY,
  ]);

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
                <Link
                  to="/"
                  className="nav-link active"
                  aria-current="page"
                  onClick={logout}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet context={{ token: cookies[REACT_APP_JWT_TOKEN_KEY] }} />
    </>
  ) : (
    <UserLoginPage />
  );

  function logout() {
    removeCookie(REACT_APP_JWT_TOKEN_KEY, {
      path: "/",
    });
  }

  function hasJWT() {
    return (
      cookies[REACT_APP_JWT_TOKEN_KEY] !== "" &&
      cookies[REACT_APP_JWT_TOKEN_KEY] != null
    );
  }
}
