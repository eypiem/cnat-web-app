import React from "react";
import { Link } from "react-router-dom";

export default function Tracker({ tracker }) {
  return (
    <div className="col-3">
      <div className="card p-0">
        <div className="card-body">
          <h5 className="card-title">{tracker["name"]}</h5>
          <h6 className="card-subtitle mb-2 font-monospace text-body-secondary">
            {tracker["id"]}
          </h6>
          <Link
            to={`/user-area/tracker/${tracker["id"]}`}
            className="btn btn-primary btn-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
