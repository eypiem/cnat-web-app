import React, { useState, useEffect } from "react";
import { useOutletContext, useParams, Navigate } from "react-router-dom";
import TrackerDetails from "components/TrackerDetails";
import TrackerDataForm from "components/TrackerDataForm";
import TrackerDataChart from "components/TrackerDataChart";

export default function TrackerPage() {
  const { REACT_APP_API_BASE_URL } = process.env;
  const { token } = useOutletContext();

  const { trackerId } = useParams();

  const [isFetching, setIsFetching] = useState(true);
  const [fetchErrorMsg, setFetchErrorMsg] = useState("");

  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");

  const [dataTypes, setDataTypes] = useState([]);
  const [chartData, setChartData] = useState({});

  const dateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hour12: false,
  };

  useEffect(() => {
    document.title = "CNAT | Tracker";
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
    });
    fetchTrackerData(null, null);
  }, []);

  return (
    <>
      {isDeleted && <Navigate to=".." replace={true} />}
      <div className=" container d-flex flex-column py-4 min-vh-100 gap-3">
        <TrackerDetails trackerId={trackerId} />
        <div className="d-flex border rounded">
          <div className="d-flex flex-column justify-content-between col-3 p-3 gap-3">
            <div>
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
            <TrackerDataForm
              isFetching={isFetching}
              onfetchTrackerData={fetchTrackerData}
            />
          </div>
          <div className="vr"></div>
          <TrackerDataChart
            isFetching={isFetching}
            fetchErrorMsg={fetchErrorMsg}
            chartData={chartData}
          />
        </div>
        {deleteErrorMsg.length > 0 && (
          <p className="text-danger">{deleteErrorMsg}</p>
        )}
        {isDeleting ? (
          <div className="spinner-border text-danger" role="status"></div>
        ) : (
          <button
            className="btn btn-outline-danger align-self-start"
            onClick={deleteTracker}
          >
            Delete tracker
          </button>
        )}
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

  function updateChartData(json) {
    let ds = [];
    let labels = [];

    json.forEach((trackerData) => {
      labels.push(
        new Intl.DateTimeFormat("en-GB", dateTimeFormatOptions).format(
          new Date(trackerData["timestamp"])
        )
      );
      Object.keys(trackerData["data"]).forEach((k, _) => {
        let labelExist = false;
        ds.forEach((e) => {
          if (k === e["label"]) {
            e["data"].push(trackerData["data"][k]);
            labelExist = true;
          }
        });
        if (!labelExist) {
          ds.push({
            label: k,
            data: [trackerData["data"][k]],
            /// TODO: Generate colors
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          });
        }
      });
    });

    console.log(ds);
    setChartData({
      labels: labels,
      datasets: ds,
    });
  }

  function deleteTracker() {
    setIsDeleting(true);
    setDeleteErrorMsg("");

    const url = `${REACT_APP_API_BASE_URL}/tracker/delete/${trackerId}`;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsDeleted(true);
        } else if (500 <= res.status && res.status < 600) {
          setDeleteErrorMsg("Server error. Please try again later.");
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          setDeleteErrorMsg("Error making request.");
        }
      })
      .catch((error) => {
        console.error(error);
        setDeleteErrorMsg("Error making request.");
      })
      .finally(() => setIsDeleting(false));
  }

  function fetchTrackerData(from, to) {
    setIsFetching(true);
    setFetchErrorMsg("");

    const url = `${REACT_APP_API_BASE_URL}/tracker-data/get/${trackerId}?from=${
      from ?? ""
    }&to=${to ?? ""}`;

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
            setFetchErrorMsg("Error fetching data");
          }
          res.json().then((json) => {
            console.error(json);
          });
          /// TODO: Subsequent .then() execute even after throwing
          throw new Error("Error fetching data");
        }
      })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        updateChartData(json);
        updateDataTypes(json);
      })
      .catch((error) => {
        console.error(error);
        setFetchErrorMsg("Error fetching data");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }
}
