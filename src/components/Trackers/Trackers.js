import React, { useState } from "react";
import Tracker from "components/Tracker/Tracker";
import { useOutletContext, Link } from "react-router-dom";

import "index.css";
import "./Trackers.css";

const url = "http://localhost:8080/tracker/get";

export default function Trackers() {
  const { userId, token } = useOutletContext();

  const [fetched, setFetched] = useState(false);
  const [trackers, setTrackers] = useState([]);

  if (!fetched) {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setTrackers(json))
      .then(() => setFetched(true))
      .catch((error) => console.error(error));
  }
  return (
    <div className="Trackers">
      <h2>Your trackers:</h2>
      {trackers.map((item) => (
        <Link to={`/user-area/tracker/${item.id}`} key={item.id}>
          <Tracker id={item.id} />
        </Link>
      ))}
    </div>
  );
}
