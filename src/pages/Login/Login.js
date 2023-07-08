
import './Login.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const url = "http://localhost:8080/auth/login";
const jwt_cookie = "jwt";

function Login() {


  var jwt = getCookie(jwt_cookie);
  if (jwt === "") {
    console.log("No JWT stored in cookies");
  } else {
    console.log("Found JWT in cookies");
    // const navigate = useNavigate();
    // navigate('/trackers', { replace: true });

  }


  return (
    <form className="Login" onSubmit={login}>
      <label>
        Email:
        <input type="text" id="email" />
      </label>
      <label>
        Password:
        <input type="password" id="password" />
      </label>
      <input type="submit" value="Login" />
      <a className='Register'>Register</a>
    </form>
  );
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function login(e) {
  e.preventDefault();
  const { email, password } = e.target.elements;
  console.log({ email: email.value, password: password.value });

  fetch(url, {
    method: 'POST',
    headers: {
      // 'Accept': "application/json, text/plain, */*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "email": email.value, "password": password.value })
  })
    .then(response => response.json())
    .then(json => storeJWT(json))
    .catch(error => console.error(error));
}

function storeJWT(response) {
  console.log(response);
  document.cookie = `${jwt_cookie}=${response['accessToken']}; SameSite=Strict`;
}


export default Login;