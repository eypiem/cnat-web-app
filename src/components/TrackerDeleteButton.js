import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

/**
 * This component displays a button used for deleting the tracker with the provided trackerId.
 * The onDelete callback is used to notify of the deletion the the tracker.
 *
 * @author Amir Parsa Mahdian
 */
export default function TrackerDeleteButton({ trackerId, onDeleted }) {
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

  /**
   * Sends a tracker delete request and calls the onDelete callback if successful.
   */
  function deleteTracker() {
    setIsDeleting(true);
    setDeleteErrorMsg("");

    const url = `/api/trackers/${trackerId}`;

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
          throw new Error("Server error. Please try again later.");
        } else {
          console.error(`Unexpected error code: ${res.status}`);
          throw new Error("Error making request");
        }
      })
      .catch((error) => {
        console.error(error);
        setDeleteErrorMsg(error.message);
      })
      .finally(() => setIsDeleting(false));
  }
}
