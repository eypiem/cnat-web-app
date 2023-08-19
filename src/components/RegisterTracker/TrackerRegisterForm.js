import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const { REACT_APP_API_BASE_URL } = process.env;

export default function TrackerRegisterForm({ setNewTracker }) {
  const { userId, token } = useOutletContext();

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-4 py-4 min-vh-100">
      <h3>Tracker Registration</h3>
      <form
        className="d-flex flex-column align-items-center gap-2 col-2"
        onSubmit={register}
      >
        <div className="w-100">
          <label htmlFor="name" className="form-label">
            Tracker Name
          </label>
          <input
            id="name"
            type="text"
            className="form-control"
            aria-label="Name"
          />
        </div>
        {errorMsg.length > 0 && (
          <p className="text-danger text-center">{errorMsg}</p>
        )}
        {isLoading ? (
          <div className="spinner-border text-primary" role="status"></div>
        ) : (
          <input
            className="btn btn-primary w-100"
            type="submit"
            value="Register"
          />
        )}
      </form>
    </div>
  );

  function register(e) {
    e.preventDefault();
    setErrorMsg("");
    setIsloading(true);
    const { name } = e.target.elements;
    const url = `${REACT_APP_API_BASE_URL}/trackers`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name.value }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then(setNewTracker);
        } else if (500 <= res.status && res.status < 600) {
          throw new Error("Server error. Please try again later.");
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          throw new Error("Error making request");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg(error.message);
      })
      .finally(() => setIsloading(false));
  }
}
