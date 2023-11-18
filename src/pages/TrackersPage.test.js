import { render, screen, waitFor } from "@testing-library/react";
import TrackersPage from "pages/TrackersPage";
import * as rrd from "react-router-dom";

let mockData = { token: "" };
jest.mock("react-router-dom");

const trackersGetResponse = {
  trackers: [
    { id: "id1", name: "tracker 1" },
    { id: "id2", name: "tracker 2" },
  ],
};

const trackersGetResponseEmpty = {
  trackers: [],
};

afterEach(() => {
  jest.restoreAllMocks();
});

it("renders tracker cards", async () => {
  rrd.useOutletContext.mockReturnValue(mockData);
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/trackers") {
        return {
          ok: true,
          status: 200,
          json: async () => trackersGetResponse,
        };
      }
    });
  render(<TrackersPage />);
  await waitFor(() => {
    expect(
      screen.getByText(trackersGetResponse["trackers"][0]["name"])
    ).toBeInTheDocument();
    expect(
      screen.getByText(trackersGetResponse["trackers"][0]["id"])
    ).toBeInTheDocument();
    expect(
      screen.getByText(trackersGetResponse["trackers"][1]["name"])
    ).toBeInTheDocument();
    expect(
      screen.getByText(trackersGetResponse["trackers"][1]["id"])
    ).toBeInTheDocument();
  });
});

it("displays no trackers message when user has no trackers", async () => {
  rrd.useOutletContext.mockReturnValue(mockData);
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/trackers") {
        return {
          ok: true,
          status: 200,
          json: async () => trackersGetResponseEmpty,
        };
      }
    });
  render(<TrackersPage />);
  await waitFor(() => {
    expect(
      screen.getByText(
        /You have no trackers. Click on "register new tracker" to create a new one./i
      )
    ).toBeInTheDocument();
  });
});

it("displays server error when server returns error", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  rrd.useOutletContext.mockReturnValue(mockData);
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/trackers") {
        return {
          ok: false,
          status: 500,
        };
      }
    });
  render(<TrackersPage />);
  await waitFor(() => {
    expect(
      screen.getByText(/Server error. Please try again later./i)
    ).toBeInTheDocument();
  });
});
