import React from "react";
import { Outlet } from "react-router-dom";
import Login from "pages/Login/Login";

import "index.css";
import "./UserAreaLayout.css";

const jwt_cookie = "jwt";

export default function UserAreaLayout() {
  const userId = "c@c.com";

  const token = getCookie(jwt_cookie);

  return hasJWT() ? (
    <>
      <div className="header">
        <p>Hi {userId}!</p>
      </div>
      <Outlet context={{ userId: userId, token: token }} />
    </>
  ) : (
    <Login />
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
