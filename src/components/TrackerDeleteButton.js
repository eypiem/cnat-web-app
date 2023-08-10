import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function TrackerDeleteButton({ trackerId, onDeleted }) {
  const { REACT_APP_API_BASE_URL } = process.env;
  const { token } = useOutletContext();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");

  return (
    <>
      {deleteErrorMsg.length > 0 && (
        <p className="text-danger">{deleteErrorMsg}</p>
      )}
      {isDeleting ? (
        <div className="spinner-border text-danger" role="status"></div>
      ) : (
        <button
          className="btn btn-outline-danger align-self-start"
          onClick={deleteTracker}
        >
          Delete tracker
        </button>
      )}
    </>
  );

  function deleteTracker() {
    setIsDeleting(true);
    setDeleteErrorMsg("");

    const url = `${REACT_APP_API_BASE_URL}/trackers/${trackerId}`;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          onDeleted();
        } else if (500 <= res.status && res.status < 600) {
          setDeleteErrorMsg("Server error. Please try again later.");
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          setDeleteErrorMsg("Error making request.");
        }
      })
      .catch((error) => {
        console.error(error);
        setDeleteErrorMsg("Error making request.");
      })
      .finally(() => setIsDeleting(false));
  }
}
