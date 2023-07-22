import React, { useState, useEffect } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import TrackerDetails from "components/TrackerDetails";
import TrackerDataForm from "components/TrackerDataForm";
import TrackerDataChart from "components/TrackerDataChart";
import TrackerDataTypes from "components/TrackerDataTypes";
import TrackerDeleteButton from "components/TrackerDeleteButton";

export default function TrackerPage() {
  const { REACT_APP_API_BASE_URL } = process.env;
  const { token } = useOutletContext();
  const { trackerId } = useParams();
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState(true);
  const [fetchErrorMsg, setFetchErrorMsg] = useState("");

  const [chartData, setChartData] = useState({});
  const [filteredChartData, setFilteredChartData] = useState({});

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
      <div className="container d-flex flex-column py-4 min-vh-100 gap-3">
        <TrackerDetails trackerId={trackerId} />
        <div className="d-flex border rounded">
          <div className="d-flex flex-column justify-content-between col-3 p-3 gap-3">
            <TrackerDataTypes
              chartData={chartData}
              onSelect={filterChartData}
            />
            <TrackerDataForm
              isFetching={isFetching}
              onfetchTrackerData={fetchTrackerData}
            />
          </div>
          <div className="vr"></div>
          <TrackerDataChart
            isFetching={isFetching}
            fetchErrorMsg={fetchErrorMsg}
            chartData={filteredChartData}
          />
        </div>
        <TrackerDeleteButton
          trackerId={trackerId}
          onDeleted={() => navigate("..")}
        />
      </div>
    </>
  );

  function filterChartData(selected) {
    let ds = [];
    chartData["datasets"].forEach((e) => {
      if (selected.includes(e["label"])) {
        ds.push(e);
      }
    });

    setFilteredChartData({
      labels: chartData["labels"],
      datasets: ds,
    });
  }

  function jsonToChartData(json) {
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

    return {
      labels: labels,
      datasets: ds,
    };
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
        setChartData(jsonToChartData(json));
        setFilteredChartData(jsonToChartData(json));
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
