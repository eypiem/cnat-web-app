import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function TrackerDetails({ trackerId }) {
  const { token } = useOutletContext();
  const { REACT_APP_API_BASE_URL } = process.env;

  const [name, setName] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [fetchErrorMsg, setFetchErrorMsg] = useState("");

  useEffect(fetchTracker, []);

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

  function fetchTracker() {
    setFetchErrorMsg("");

    const url = `${REACT_APP_API_BASE_URL}/tracker/get/${trackerId}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res;
        } else {
          if (500 <= res.status && res.status < 600) {
            setFetchErrorMsg("Server error. Please try again later");
          } else {
            console.error(`Unexpected error code: ${res.status}`);
            setFetchErrorMsg("Error fetching tracker name");
          }
          res.json().then((json) => {
            console.error(json);
          });
          /// TODO: Subsequent .then() execute even after throwing
          throw new Error("Error fetching tracker name");
        }
      })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setName(json["name"]);
      })
      .catch((error) => {
        console.error(error);
        setFetchErrorMsg("Error fetching tracker name");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }
}
