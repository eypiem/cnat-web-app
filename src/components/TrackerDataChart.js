import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Colors,
} from "chart.js";
import { Line } from "react-chartjs-2";

/**
 * This component represents a chart.js line chart displaying the provided data.
 *
 * @author Amir Parsa Mahdian
 */
export default function TrackerDataChart({
  isFetching,
  fetchErrorMsg,
  chartData,
}) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
    Colors
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      colors: {
        forceOverride: true,
      },
    },
    tension: 0.4,
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light w-100 p-3">
      {isFetching ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : fetchErrorMsg.length > 0 ? (
        <p className="text-danger">{fetchErrorMsg}</p>
      ) : chartData["datasets"].length === 0 ? (
        <p>No data</p>
      ) : (
        <Line options={chartOptions} data={chartData} />
      )}
    </div>
  );
}
