import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TrackerRegisterResult({ newTracker }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-4 py-4 min-vh-100">
      <div className="card col-4 p-0">
        <div className="card-body px-0 pb-0">
          <h5 className="card-title px-3">Tracker Name</h5>
          <h6 className="card-subtitle mb-2 px-3 text-body-secondary">
            <span className="font-monospace ">
              {newTracker["tracker"]["id"]}
            </span>
          </h6>
          <p className="card-text px-3 text-danger">
            Be sure to make note of your tracker access token and keep it
            private. Once this page is closed, you won't be able to view this
            access token again.
          </p>
          <br />
          <div className="bg-warning-subtle p-3">
            <span className="font-monospace text-dark text-break">
              {newTracker["accessToken"]}
            </span>
          </div>
        </div>
      </div>
      <Link to={".."} className="btn btn-primary">
        Back to Trackers
      </Link>
    </div>
  );
}
