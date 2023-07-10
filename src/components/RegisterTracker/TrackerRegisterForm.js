import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const url = "http://localhost:8080/tracker/register";

export default function TrackerRegisterForm({ setNewTracker }) {
  const { userId, token } = useOutletContext();

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);

  return (
    <>
      <form
        className="d-flex flex-column align-items-center gap-3"
        onSubmit={(e) =>
          login(e, token, setNewTracker, setErrorMsg, setIsloading)
        }
      >
        <div className="input-group flex-nowrap">
          <input
            id="name"
            type="text"
            className="form-control"
            placeholder="Name"
            aria-label="Name"
            aria-describedby="addon-wrapping"
          />
        </div>
        {errorMsg.length > 0 && <p className="text-danger">{errorMsg}</p>}
        {isLoading ? (
          <div className="spinner-border text-primary" role="status"></div>
        ) : (
          <input className="btn btn-primary" type="submit" value="Register" />
        )}
      </form>
    </>
  );
}

function login(e, token, setNewTracker, setErrorMsg, setIsloading) {
  e.preventDefault();
  setIsloading(true);
  setErrorMsg("");
  const { email, password } = e.target.elements;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({ email: email.value, password: password.value }),
  })
    .then((res) => {
      if (res.status === 200) {
        res.json().then((json) => {
          setNewTracker(json);
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
