import React, { useEffect, useState } from "react";

import TrackerRegisterForm from "components/RegisterTracker/TrackerRegisterForm";
import TrackerRegisterResult from "components/RegisterTracker/TrackerRegisterResult";

export default function TrackerRegisterPage() {
  const [newTracker, setNewTracker] = useState({});

  useEffect(() => {
    document.title = "CNAT | Tracker Registration";
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      {Object.keys(newTracker).length === 0 ? (
        <TrackerRegisterForm setNewTracker={setNewTracker} />
      ) : (
        <TrackerRegisterResult newTracker={newTracker} />
      )}
    </div>
  );
}
