import React from "react";
import { Outlet } from "react-router-dom";
import UserLoginPage from "pages/UserLoginPage";

import "index.css";
import "./UserAreaLayout.css";

const jwt_cookie = "jwt";

export default function UserAreaLayout() {
  const token = getCookie(jwt_cookie);
  console.log(`UserAreaLayout: is logged in: ${hasJWT()}`);

  return hasJWT() ? (
    <>
      <div className="header">
        <p>Hi!</p>
      </div>
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
