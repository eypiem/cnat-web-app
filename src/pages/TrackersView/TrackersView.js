import React, { useState } from "react";
import Tracker from "components/Tracker/Tracker";
import { Link, useOutletContext } from "react-router-dom";

import "index.css";

const url = "http://localhost:8080/tracker/get";

export default function TrackersView() {
  const { userId, token } = useOutletContext();

  const [fetched, setFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trackers, setTrackers] = useState([]);

  if (!fetched) {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res
            .json()
            .then((json) => setTrackers(json))
            .then(() => setFetched(true));
        } else if (500 <= res.status && res.status < 600) {
          setErrorMsg("Server error. Please try again later.");
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          setErrorMsg("Error fetching data.");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg("Error fetching data.");
      });
  }
  return (
    <div className="container d-flex flex-column py-4 gap-4">
      <Link to="register" className="btn btn-primary align-self-start">
        Register new tracker
      </Link>
      <h2>Your trackers:</h2>
      {errorMsg.length > 0 ? (
        <p className="text-danger col-12">{errorMsg}</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {!fetched ? (
            <div className="col-3">
              <div className="card m-2 p-0" aria-hidden="true">
                <div className="card-body">
                  <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </h5>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-4"></span>
                  </p>
                  <a className="btn btn-primary disabled placeholder-glow"></a>
                </div>
                <div className="card-footer placeholder-glow"></div>
              </div>
            </div>
          ) : (
            trackers.map((item) => <Tracker key={item.id} id={item.id} />)
          )}
        </div>
      )}
    </div>
  );
}
