import { useEffect, useCallback } from "react";
import { Link, Outlet } from "react-router-dom";
import UserLoginPage from "pages/UserLoginPage";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import JWT_COOKIE_KEY from "constants";

/**
 * This component represents the root layout for pages requiring user login.
 * Provides the JWT as context to all children.
 *
 * @author Amir Parsa Mahdian
 */
export default function UserAreaLayout() {
  const [cookies, , removeCookie] = useCookies([JWT_COOKIE_KEY]);

  const jwt = cookies[JWT_COOKIE_KEY];
  const hasJwt = jwt !== "" && jwt != null;

  /**
   * Logs out by deleting the token cookie.
   */
  const logout = useCallback(() => {
    removeCookie(JWT_COOKIE_KEY, {
      path: "/",
    });
  }, [removeCookie]);

  useEffect(() => {
    const jwtHasExpired = () => {
      const decodedToken = jwt_decode(jwt);
      const currentDate = new Date();
      return decodedToken.exp * 1000 < currentDate.getTime();
    };

    if (hasJwt) {
      if (jwtHasExpired()) {
        console.warn("Token expired.");
        logout();
      }
    }
  }, [hasJwt, jwt, logout]);

  return hasJwt ? (
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
                  to="/user-area/dashboard"
                  className="nav-link active"
                  aria-current="page"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/user-area/tracker"
                  className="nav-link active"
                  aria-current="page"
                >
                  Trackers
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
      <Outlet context={{ token: jwt }} />
    </>
  ) : (
    <UserLoginPage />
  );
}
