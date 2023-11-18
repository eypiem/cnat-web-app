import React, { useEffect, useState } from "react";

import TrackerRegisterForm from "components/TrackerRegisterForm";
import TrackerRegisterResult from "components/TrackerRegisterResult";

/**
 * This component represents the tracker registration page.
 *
 * @author Amir Parsa Mahdian
 */
export default function TrackerRegisterPage() {
  const [newTracker, setNewTracker] = useState({});

  useEffect(() => {
    document.title = "CNAT | Tracker Registration";
  }, []);

  return Object.keys(newTracker).length === 0 ? (
    <TrackerRegisterForm onTrackerRegister={setNewTracker} />
  ) : (
    <TrackerRegisterResult newTracker={newTracker} />
  );
}
