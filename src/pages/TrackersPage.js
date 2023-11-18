import React, { useState, useEffect } from "react";
import Tracker from "components/Tracker";
import { Link, useOutletContext } from "react-router-dom";

/**
 * This component represents the trackers page.
 *
 * @author Amir Parsa Mahdian
 */
export default function TrackersPage() {
  const { token } = useOutletContext();

  const [isFetching, setIsFetching] = useState(true);
  const [fetchErrorMsg, setFetchErrorMsg] = useState("");
  const [trackers, setTrackers] = useState([]);

  useEffect(() => {
    document.title = "CNAT | Trackers";

    const fetchTrackers = () => {
      setFetchErrorMsg("");

      const url = `/api/trackers`;

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res;
          } else if (500 <= res.status && res.status < 600) {
            throw new Error("Server error. Please try again later.");
          } else {
            console.error(`Unexpected error code: ${res.status}`);
            throw new Error("Error fetching trackers");
          }
        })
        .then((res) => res.json())
        .then((json) => {
          setTrackers(json["trackers"]);
        })
        .catch((error) => {
          console.error(error);
          setFetchErrorMsg(error.message);
        })
        .finally(() => {
          setIsFetching(false);
        });
    };
    fetchTrackers();
  }, [token]);

  return (
    <div className="container d-flex flex-column py-4 gap-4 min-vh-100">
      <Link to="register" className="btn btn-primary align-self-start">
        Register new tracker
      </Link>
      <h2>Your trackers:</h2>
      <div className="d-flex flex-wrap gap-3">
        {isFetching ? (
          <div className="col-3">
            <div className="card m-2 p-0" aria-hidden="true">
              <div className="card-body">
                <h5 className="card-title placeholder-wave">
                  <span className="placeholder col-6"></span>
                </h5>
                <p className="card-text placeholder-wave">
                  <span className="placeholder col-8"></span>
                </p>
                <div className="btn btn-primary disabled placeholder-wave"></div>
              </div>
            </div>
          </div>
        ) : fetchErrorMsg.length > 0 ? (
          <p className="text-danger col-12">{fetchErrorMsg}</p>
        ) : trackers.length === 0 ? (
          <p className="col-12">
            You have no trackers. Click on "register new tracker" to create a
            new one.
          </p>
        ) : (
          trackers.map((e) => <Tracker key={e.id} tracker={e} />)
        )}
      </div>
    </div>
  );
}
