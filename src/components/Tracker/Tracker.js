import React from "react";

import "index.css";
import "./Tracker.css";

export default function Tracker({ id }) {
  return (
    <div className="Tracker">
      <h5>{id}</h5>
    </div>
  );
}
