import { render, screen, fireEvent } from "@testing-library/react";
import TrackerRegisterPage from "./TrackerRegisterPage";
import userEvent from "@testing-library/user-event";
import * as rrd from "react-router-dom";

let mockData = { token: "" };
jest.mock("react-router-dom");

const trackerRegisterRequest = {
  name: "Tracker 1",
};

const trackerRegisterResponse = {
  tracker: { id: "id1", name: trackerRegisterRequest["name"] },
  accessToken: "jwt",
};

const validationErrors = {
  validationErrors: [{ field: "Name", error: "Name is not valid" }],
};

beforeEach(() => {
  rrd.useOutletContext.mockReturnValue(mockData);
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("registers a new tracker and displays access token", async () => {
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url.startsWith(`/api/trackers`)) {
        return {
          ok: true,
          status: 200,
          json: async () => trackerRegisterResponse,
        };
      }
    });
  render(<TrackerRegisterPage />);
  const trackerNameInput = screen.getByLabelText(/Name/i);

  fireEvent.change(trackerNameInput, {
    target: { value: trackerRegisterRequest["name"] },
  });

  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: /Register/i,
    })
  );

  const id = await screen.findByText(trackerRegisterResponse["tracker"]["id"]);
  expect(id).toBeInTheDocument();

  const accessToken = await screen.findByText(
    trackerRegisterResponse["accessToken"]
  );
  expect(accessToken).toBeInTheDocument();
});

it("displays validation error when user input does not meet server constraints", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url.startsWith(`/api/trackers`)) {
        return {
          ok: false,
          status: 400,
          json: async () => validationErrors,
        };
      }
    });
  render(<TrackerRegisterPage />);
  const trackerNameInput = screen.getByLabelText(/Name/i);

  fireEvent.change(trackerNameInput, {
    target: { value: trackerRegisterRequest["name"] },
  });

  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: /Register/i,
    })
  );

  const message = screen.getByText(
    validationErrors["validationErrors"][0]["error"]
  );
  expect(message).toBeInTheDocument();
});

it("displays server error when server returns error", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url.startsWith(`/api/trackers`)) {
        return {
          ok: false,
          status: 500,
        };
      }
    });
  render(<TrackerRegisterPage />);
  const trackerNameInput = screen.getByLabelText(/Name/i);

  fireEvent.change(trackerNameInput, {
    target: { value: trackerRegisterRequest["name"] },
  });

  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: /Register/i,
    })
  );

  const message = await screen.findByText(
    /Server error. Please try again later./i
  );
  expect(message).toBeInTheDocument();
});
