import React from "react";

export default function TrackerDataForm({ isFetching, onfetchTrackerData }) {
  return (
    <form
      className="d-flex flex-column align-items-center gap-2"
      onSubmit={onSubmit}
    >
      <div className="w-100">
        <label className="form-label">From</label>
        <div className="input-group flex-nowrap">
          <input
            id="fromDate"
            type="date"
            className="form-control"
            aria-label="From"
            aria-describedby="addon-wrapping"
          />
          <input
            id="fromTime"
            type="time"
            className="form-control"
            aria-label="From"
            aria-describedby="addon-wrapping"
          />
        </div>
      </div>
      <div className="w-100">
        <label className="form-label">To</label>
        <div className="input-group flex-nowrap">
          <input
            id="toDate"
            type="date"
            className="form-control"
            aria-label="From"
            aria-describedby="addon-wrapping"
          />
          <input
            id="toTime"
            type="time"
            className="form-control"
            aria-label="From"
            aria-describedby="addon-wrapping"
          />
        </div>
      </div>
      {isFetching ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : (
        <input
          className="btn btn-primary btn-sm"
          type="submit"
          value="Fetch data"
        />
      )}
    </form>
  );

  function onSubmit(e) {
    e.preventDefault();
    const { fromDate, fromTime, toDate, toTime } = e.target.elements;

    const from = dateAndTimeToTimestamp(fromDate.value, fromTime.value);
    const to = dateAndTimeToTimestamp(toDate.value, toTime.value);

    onfetchTrackerData(from, to);
  }

  function dateAndTimeToTimestamp(date, time) {
    return date !== ""
      ? `${date}T${time !== "" ? `${time}` : "00:00"}:00Z`
      : "";
  }
}
