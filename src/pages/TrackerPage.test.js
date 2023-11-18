import { render, screen, waitFor } from "@testing-library/react";
import TrackerPage from "pages/TrackerPage";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";

let mockData = { token: "jwt" };

const tracker = {
  id: "id1",
  name: "Tracker 1",
};

const trackerDataGetResponse = {
  trackerData: [
    {
      data: { prop1: 111, coordinates: [0.0, 0.0] },
      timestamp: "2023-01-01T00:00:00Z",
    },
    {
      data: { prop1: 112, coordinates: [0.0, 0.0] },
      timestamp: "2023-01-01T00:00:01Z",
    },
  ],
};

const trackerGetResponse = {
  tracker: tracker,
};

beforeEach(() => {
  window.scrollTo = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("renders tracker info, data, and coordinates", async () => {
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url.startsWith(`/api/trackers/${tracker["id"]}/data`)) {
        return {
          ok: true,
          status: 200,
          json: async () => trackerDataGetResponse,
        };
      } else if (url === `/api/trackers/${tracker["id"]}`) {
        return {
          ok: true,
          status: 200,
          json: async () => trackerGetResponse,
        };
      }
    });
  const { container } = render(
    <MemoryRouter initialEntries={[`/tracker/${tracker["id"]}`]}>
      <Routes>
        <Route path="tracker" element={<Outlet context={mockData} />}>
          <Route path=":trackerId" element={<TrackerPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  const id = await screen.findByText(tracker["id"]);
  expect(id).toBeInTheDocument();

  const name = await screen.findByText(tracker["name"]);
  expect(name).toBeInTheDocument();

  const prop1 = await screen.findByText("prop1");
  expect(prop1).toBeInTheDocument();

  await waitFor(() => {
    const markers = container.getElementsByClassName("leaflet-marker-icon");
    expect(markers.length).toBe(trackerDataGetResponse["trackerData"].length);
  });
});

it("shows no tracker data when tracker has no data", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url.startsWith(`/api/trackers/${tracker["id"]}/data`)) {
        return {
          ok: false,
          status: 404,
        };
      } else if (url === `/api/trackers/${tracker["id"]}`) {
        return {
          ok: true,
          status: 200,
          json: async () => trackerGetResponse,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={[`/tracker/${tracker["id"]}`]}>
      <Routes>
        <Route path="tracker" element={<Outlet context={mockData} />}>
          <Route path=":trackerId" element={<TrackerPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  const id = await screen.findByText(tracker["id"]);
  expect(id).toBeInTheDocument();

  const name = await screen.findByText(tracker["name"]);
  expect(name).toBeInTheDocument();

  const noData = await screen.findByText(/No data/i);
  expect(noData).toBeInTheDocument();
});

it("deletes tracker and redirect to trackers page", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === `/api/trackers/${tracker["id"]}`) {
        return {
          ok: true,
          status: 200,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={[`/tracker/${tracker["id"]}`]}>
      <Routes>
        <Route path="tracker" element={<Outlet context={mockData} />}>
          <Route index element={<h1>TrackersPage</h1>} />
          <Route path=":trackerId" element={<TrackerPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: /Delete tracker/i,
    })
  );

  const trackersPage = screen.getByText("TrackersPage");
  expect(trackersPage).toBeInTheDocument();
});

it("displays server error when server returns error", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url.startsWith(`/api/trackers/${tracker["id"]}/data`)) {
        return {
          ok: false,
          status: 500,
        };
      } else if (url === `/api/trackers/${tracker["id"]}`) {
        return {
          ok: false,
          status: 500,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={[`/tracker/${tracker["id"]}`]}>
      <Routes>
        <Route path="tracker" element={<Outlet context={mockData} />}>
          <Route path=":trackerId" element={<TrackerPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  const message = await screen.findAllByText(
    /Server error. Please try again later./i
  );
  expect(message).not.toHaveLength(0);
});
