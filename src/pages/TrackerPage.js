import React, { useState } from "react";
import { useOutletContext, useParams, Navigate } from "react-router-dom";

const url = "http://localhost:8080/tracker-data";

export default function TrackerPage() {
  const { trackerId } = useParams();
  const { token } = useOutletContext();

  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [dataTypes, setDataTypes] = useState(["accX", "accY", "accZ", "temp"]);

  if (!fetched && !isDeleted) {
    fetch(`${url}/get/${trackerId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
        updateDataTypes(json);
      })
      .then(() => setFetched(true))
      .catch((error) => console.error(error));
  }

  return (
    <>
      {isDeleted && <Navigate to=".." replace={true} />}
      <div className=" container d-flex flex-column py-4 min-vh-100 gap-3">
        {isLoading ? (
          <div className="spinner-border text-danger" role="status"></div>
        ) : (
          <button
            className="btn btn-outline-danger align-self-start"
            onClick={deleteTracker}
          >
            Delete tracker
          </button>
        )}

        <div>
          <h4 className="">{data["name"]}</h4>
          <h5 className="mb-2 font-monospace text-body-secondary">
            {trackerId}
          </h5>
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

  function updateDataTypes(json) {
    let dataTypes = [];
    json.forEach((e, _) =>
      Object.keys(e["data"]).forEach(
        (k, _) => dataTypes.indexOf(k) === -1 && dataTypes.push(k)
      )
    );
    setDataTypes(dataTypes);
  }

  function deleteTracker() {
    console.log("deleteTracker(): called");
    // setErrorMsg("");
    setIsLoading(true);
    fetch(`http://localhost:8080/tracker/delete/${trackerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setIsDeleted(true);
        } else if (500 <= res.status && res.status < 600) {
          // setErrorMsg("Server error. Please try again later.");
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          // setErrorMsg("Error making request.");
        }
      })
      .catch((error) => {
        console.error(error);
        // setErrorMsg("Error making request.");
      })
      .finally(() => setIsLoading(false));
  }
}
