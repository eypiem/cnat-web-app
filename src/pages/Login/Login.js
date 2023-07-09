import "./Login.css";
import "index.css";

const url = "http://localhost:8080/auth/login";
const jwt_cookie = "jwt";

export default function Login() {
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
      {/* <a className='Register'>Register</a> */}
    </form>
  );
}

function login(e) {
  e.preventDefault();
  const { email, password } = e.target.elements;

  fetch(url, {
    method: "POST",
    headers: {
      // 'Accept': "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
    .then((response) => response.json())
    .then((json) => storeJWT(json))
    .then(() => {
      console.log("logged in");
      // navigate("/user-area/trackers");
    })
    .catch((error) => console.error(error));
}

function storeJWT(response) {
  console.log(response);
  document.cookie = `${jwt_cookie}=${response["accessToken"]}; SameSite=Strict`;
}
