import React, { useState } from "react";

/**
 * This component displays checkboxes for each of the labels in the provided chart data
 * and notifies of the changes through the provied callback.
 *
 * @author Amir Parsa Mahdian
 */
export default function TrackerDataTypes({ chartData, onSelect }) {
  const [selected, setSelected] = useState([]);

  return (
    <div className="d-flex flex-column gap-3">
      <h6>Data types:</h6>
      <div className="d-flex flex-wrap gap-3">
        {chartData["datasets"]
          ?.filter((e) => typeof e["data"][0] === "number")
          .map((e) => e["label"])
          .map((e) => (
            <div className="form-check" key={e}>
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id={e}
                onChange={() => {
                  let s = selected;
                  const i = s.indexOf(e);
                  i === -1 ? s.push(e) : s.splice(i, 1);
                  setSelected(s);
                  onSelect(s);
                }}
              />
              <label className="form-check-label" htmlFor={e}>
                {e}
              </label>
            </div>
          ))}
      </div>
    </div>
  );
}
