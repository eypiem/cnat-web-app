import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const { REACT_APP_API_BASE_URL } = process.env;

const initPosition = [51.505, -0.09];

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

const trackerIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});

export default function DashboardPage() {
  const { token } = useOutletContext();

  const [isFetching, setIsFetching] = useState(true);
  const [fetchErrorMsg, setFetchErrorMsg] = useState("");
  const [trackersLatestData, setTrackersLatestData] = useState([]);

  useEffect(() => {
    document.title = "CNAT | Dashboard";
    fetchTrackersLatestData();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      {isFetching ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : fetchErrorMsg.length > 0 ? (
        <p className="text-danger col-12">{fetchErrorMsg}</p>
      ) : (
        <MapContainer
          center={initPosition}
          zoom={4}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "600px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {trackersLatestData
            .filter((e) => e["data"]["location"] != null)
            .map((e) => (
              <Marker
                position={[
                  e["data"]["location"]["lat"],
                  e["data"]["location"]["long"],
                ]}
                icon={trackerIcon}
                key={e["tracker"]["id"]}
              >
                <Popup>
                  <div className="card p-0">
                    <div className="card-body">
                      <h5 className="card-title">{e["tracker"]["name"]}</h5>
                      <h6 className="card-subtitle mb-2 font-monospace text-body-secondary">
                        {e["tracker"]["id"]}
                      </h6>
                      <p className="card-text">
                        Last update:{" "}
                        {new Intl.DateTimeFormat(
                          "en-GB",
                          dateTimeFormatOptions
                        ).format(new Date(e["timestamp"]))}
                      </p>
                      <Link
                        to={`/user-area/tracker/${e["tracker"]["id"]}`}
                        className="btn btn-primary btn-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )}
    </div>
  );

  function fetchTrackersLatestData() {
    setFetchErrorMsg("");

    const url = `${REACT_APP_API_BASE_URL}/trackers/data/latest`;

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
            setFetchErrorMsg("Server error. Please try again later.");
          } else {
            console.error(`Unexpected error code: ${res.status}`);
            setFetchErrorMsg("Error fetching tracker data");
          }
          res.json().then((json) => {
            console.error(json);
          });
          /// TODO: Subsequent .then() execute even after throwing
          throw new Error("Error fetching tracker data");
        }
      })
      .then((res) => res.json())
      .then((json) => {
        setTrackersLatestData(json);
      })
      .catch((error) => {
        console.error(error);
        setFetchErrorMsg("Error fetching tracker data");
      })
      .finally(() => {
        setIsFetching(false);
      });
    setIsFetching(false);
  }
}
