import React, { useState } from "react";
import Tracker from "components/Tracker";
import { Link, useOutletContext } from "react-router-dom";

const { REACT_APP_API_BASE_URL } = process.env;

export default function TrackersPage() {
  const { token } = useOutletContext();

  const [fetched, setFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trackers, setTrackers] = useState([]);

  if (!fetched) {
    const url = `${REACT_APP_API_BASE_URL}/tracker/get`;
    fetch(url, {
      method: "GET",
      headers: {
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
    <div className="container d-flex flex-column py-4 gap-4 min-vh-100">
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
                  <div className="btn btn-primary disabled placeholder-glow"></div>
                </div>
              </div>
            </div>
          ) : (
            trackers.map((e) => <Tracker key={e.id} tracker={e} />)
          )}
        </div>
      )}
    </div>
  );
}
