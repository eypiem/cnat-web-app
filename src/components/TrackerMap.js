import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

export default function TrackerMap({ json }) {
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

  return (
    Array.isArray(json) && (
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
        {json
          ?.filter((e) => e["data"]["coordinates"] != undefined)
          .map((e) => (
            <Marker
              position={e["data"]["coordinates"]}
              icon={trackerIcon}
              key={e["timestamp"]}
            >
              <Popup>
                <div className="card p-0">
                  <div className="card-body">
                    <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(
                        e["data"],
                        (key, value) => {
                          if (key === "coordinates") {
                            return undefined;
                          }
                          return value;
                        },
                        2
                      )}
                    </p>
                    <p className="card-text">
                      {new Intl.DateTimeFormat(
                        "en-GB",
                        dateTimeFormatOptions
                      ).format(new Date(e["timestamp"]))}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        <Polyline
          positions={json
            ?.filter((e) => e["data"]["coordinates"] != undefined)
            .map((e) => e["data"]["coordinates"])}
        />
      </MapContainer>
    )
  );
}
