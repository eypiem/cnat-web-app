import React from "react";
import { Link } from "react-router-dom";

import "index.css";

export default function Tracker({ id }) {
  return (
    <div className="col-3">
      <div className="card p-0">
        <div className="card-body">
          <h5 className="card-title">Tracker Name</h5>
          <h6 className="card-subtitle mb-2 font-monospace text-body-secondary">
            {id}
          </h6>

          <Link
            to={`/user-area/tracker/${id}`}
            className="btn btn-primary btn-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
