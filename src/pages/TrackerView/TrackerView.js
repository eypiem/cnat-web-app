import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const url = "http://localhost:8080/tracker-data/get";

export default function TrackerView() {
  const { trackerId } = useParams();
  const { userId, token } = useOutletContext();

  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState([]);

  const [dataTypes, setDataTypes] = useState(["accX", "accY", "accZ", "temp"]);

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
      .then((json) => {
        setData(json);
        updateDataTypes(json, setDataTypes);
      })
      .then(() => setFetched(true))
      .catch((error) => console.error(error));
  }
  return (
    <>
      <div className="container py-4">
        <div className="row">
          <h3>Tracker {trackerId}</h3>
        </div>
        <div className="row border rounded">
          <div className="col-3 p-2">
            {dataTypes.map((e) => (
              <div className="form-check" key={e}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id={e}
                />
                <label className="form-check-label" htmlFor={e}>
                  {e}
                </label>
              </div>
            ))}
          </div>
          <div className="col-9">
            {data.map((e) => (
              <p key={e["timestamp"]}>{JSON.stringify(e["data"])}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  function updateDataTypes(json, setDataTypes) {
    let dataTypes = [];
    json.forEach((e, _) =>
      Object.keys(e["data"]).forEach(
        (k, _) => dataTypes.indexOf(k) === -1 && dataTypes.push(k)
      )
    );
    setDataTypes(dataTypes);
  }
}
