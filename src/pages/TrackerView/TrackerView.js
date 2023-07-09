import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import "index.css";
import "./TrackerView.css";

const url = "http://localhost:8080/tracker-data/get";

export default function TrackerView() {
  const { trackerId } = useParams();
  const { userId, token } = useOutletContext();

  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState([]);

  if (!fetched) {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tracker: {
          id: trackerId,
          userId: userId,
        },
      }),
    })
      .then((response) => response.json())
      .then((json) => setData(json))
      .then(() => setFetched(true))
      .catch((error) => console.error(error));
  }
  return (
    <div className="TrackerData">
      <h3>Tracker {trackerId}</h3>
      {data.map((e) => (
        <p key={e["timestamp"]}>{JSON.stringify(e["data"])}</p>
      ))}
    </div>
  );
}
