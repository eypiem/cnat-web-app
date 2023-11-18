import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

/**
 * This component fetches and displays the name and id the tracker with the provided trackerId.
 *
 * @author Amir Parsa Mahdian
 */
export default function TrackerDetails({ trackerId }) {
  const { token } = useOutletContext();

  const [name, setName] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [fetchErrorMsg, setFetchErrorMsg] = useState("");

  useEffect(() => {
    const fetchTracker = () => {
      setFetchErrorMsg("");

      const url = `/api/trackers/${trackerId}`;

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
            throw new Error("Error fetching tracker name");
          }
        })
        .then((res) => res.json())
        .then((json) => {
          setName(json["tracker"]["name"]);
        })
        .catch((error) => {
          console.error(error);
          setFetchErrorMsg(error.message);
        })
        .finally(() => {
          setIsFetching(false);
        });
    };
    fetchTracker();
  }, [token, trackerId]);

  return (
    <>
      {isFetching ? (
        <h5 className="placeholder-wave">
          <span className="placeholder col-2 placeholder-lg"></span>
        </h5>
      ) : fetchErrorMsg.length > 0 ? (
        <p className="text-danger">{fetchErrorMsg}</p>
      ) : (
        <h4>{name}</h4>
      )}
      <h5 className="mb-2 font-monospace text-body-secondary">{trackerId}</h5>
    </>
  );
}
