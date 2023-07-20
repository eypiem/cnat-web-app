import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

export default function TrackerDataChart({
  isFetching,
  fetchErrorMsg,
  chartData,
}) {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
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
