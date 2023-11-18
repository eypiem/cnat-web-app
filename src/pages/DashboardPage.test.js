import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "pages/DashboardPage";
import * as rrd from "react-router-dom";

let mockData = { token: "jwt" };
jest.mock("react-router-dom");

const trackersGetLatestResponse = {
  latestTrackerData: [
    {
      tracker: { id: "id1", name: "tracker 1" },
      data: { prop1: 111, coordinates: [0.0, 0.0] },
      timestamp: "2023-01-01T00:00:00Z",
    },
    {
      tracker: { id: "id2", name: "tracker 2" },
      data: { prop1: 121, coordinates: [0.0, 0.0] },
      timestamp: "2023-01-01T00:00:00Z",
    },
  ],
};

beforeEach(() => {
  rrd.useOutletContext.mockReturnValue(mockData);
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("renders markers on the map for each tracker", async () => {
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/trackers/data/latest") {
        return {
          ok: true,
          status: 200,
          json: async () => trackersGetLatestResponse,
        };
      }
    });
  const { container } = render(<DashboardPage />);
  await waitFor(() => {
    const markers = container.getElementsByClassName("leaflet-marker-icon");
    expect(markers.length).toBe(
      trackersGetLatestResponse["latestTrackerData"].length
    );
  });
});

it("displays server error when server returns error", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/trackers/data/latest") {
        return {
          ok: false,
          status: 500,
        };
      }
    });
  render(<DashboardPage />);
  const message = await screen.findByText(
    /Server error. Please try again later./i
  );
  expect(message).toBeInTheDocument();
});
