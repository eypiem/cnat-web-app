import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

/**
 * This component represents the tracker registration form.
 *
 * @param onTrackerRegister callback called when tracker registration is successful
 * @author Amir Parsa Mahdian
 */
export default function TrackerRegisterForm({ onTrackerRegister }) {
  const { token } = useOutletContext();

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
            required
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

  /**
   * Sends a tracker register request from the form values and calls the onRegisteredTracker callback if successful.
   *
   * @param e event of form containing name input field
   */
  function register(e) {
    e.preventDefault();
    setErrorMsg("");
    setIsloading(true);
    const { name } = e.target.elements;
    const url = `/api/trackers`;

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
          res.json().then(onTrackerRegister);
        } else if (res.status === 400) {
          res.json().then((json) => {
            if (json["validationErrors"] != null) {
              setErrorMsg(
                json["validationErrors"].map((e) => e["error"]).join("\n")
              );
            }
          });
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
