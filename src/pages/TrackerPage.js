import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import TrackerDetails from "components/TrackerDetails";
import TrackerDataFilterForm from "components/TrackerDataFilterForm";
import TrackerDataChart from "components/TrackerDataChart";
import TrackerDataTypes from "components/TrackerDataTypes";
import TrackerDeleteButton from "components/TrackerDeleteButton";
import TrackerMap from "components/TrackerMap";

/**
 * This component represents the tracker page.
 *
 * @author Amir Parsa Mahdian
 */
export default function TrackerPage() {
  const { token } = useOutletContext();
  const { trackerId } = useParams();
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState(true);
  const [fetchErrorMsg, setFetchErrorMsg] = useState("");

  const [json, setJson] = useState([]);
  const [chartData, setChartData] = useState({});
  const [filteredChartData, setFilteredChartData] = useState({});

  /**
   * Maps the tracker data array to the chart.js chart data representation.
   *
   * @param trackerData array of tracker data
   * @returns the chart.js chart data representation of the provided trackerData
   */
  const trackerDataToChartData = useCallback((trackerData) => {
    const dateTimeFormatOptions = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
      timeZone: "UTC",
      hour12: false,
    };
    let ds = [];
    let labels = [];

    trackerData.forEach((trackerData) => {
      labels.push(
        new Intl.DateTimeFormat("en-GB", dateTimeFormatOptions).format(
          new Date(trackerData["timestamp"])
        )
      );
      Object.keys(trackerData["data"]).forEach((k, _) => {
        if (k !== "coordinates") {
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
            });
          }
        }
      });
    });

    return {
      labels: labels,
      datasets: ds,
    };
  }, []);

  /**
   * Fetches the tracker data with the provided query parameters.
   *
   * @param from query trackers with a timestamp greater than
   * @param to query trackers with a timestamp smaller than
   */
  const fetchTrackerData = useCallback(
    (from, to) => {
      setIsFetching(true);
      setFetchErrorMsg("");

      const url = `/api/trackers/${trackerId}/data?from=${from ?? ""}&to=${
        to ?? ""
      }`;

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res;
          } else if (res.status === 404) {
            throw new Error("No data");
          } else if (500 <= res.status && res.status < 600) {
            throw new Error("Server error. Please try again later.");
          } else {
            console.error(`Unexpected error code: ${res.status}`);
            throw new Error("Error fetching data");
          }
        })
        .then((res) => res.json())
        .then((json) => {
          setJson(json["trackerData"]);
          setChartData(trackerDataToChartData(json["trackerData"]));
          setFilteredChartData(trackerDataToChartData(json["trackerData"]));
        })
        .catch((error) => {
          console.error(error);
          setFetchErrorMsg(error.message);
        })
        .finally(() => {
          setIsFetching(false);
        });
    },
    [
      token,
      trackerId,
      setIsFetching,
      setFetchErrorMsg,
      setJson,
      setChartData,
      setFilteredChartData,
      trackerDataToChartData,
    ]
  );

  useEffect(() => {
    document.title = "CNAT | Tracker";
    window.scrollTo({
      top: 0,
      left: 0,
    });
    fetchTrackerData(null, null);
  }, [fetchTrackerData]);

  return (
    <div className="container d-flex flex-column py-4 min-vh-100 gap-3">
      <TrackerDetails trackerId={trackerId} />
      <div className="d-flex flex-column border rounded">
        <div className="d-flex border rounded">
          <div className="d-flex flex-column justify-content-between col-3 p-3 gap-3">
            <TrackerDataTypes
              chartData={chartData}
              onSelect={filterChartData}
            />
            <TrackerDataFilterForm
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
        <TrackerMap json={json} />
      </div>
      <TrackerDeleteButton
        trackerId={trackerId}
        onDeleted={() => navigate("..")}
      />
    </div>
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
}
