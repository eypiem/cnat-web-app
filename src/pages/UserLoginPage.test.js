import { render, screen, fireEvent } from "@testing-library/react";
import UserLoginPage from "./UserLoginPage";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import JWT_COOKIE_KEY from "constants";

const userAuthRequest = {
  email: "test1@test.com",
  password: "12345678",
};

const userAuthResponse = {
  email: userAuthRequest["email"],
  accessToken: "jwt",
};

const validationErrors = {
  validationErrors: [{ field: "Email", error: "Email format is not valid" }],
};

afterEach(() => {
  jest.restoreAllMocks();
  document.cookie = `${JWT_COOKIE_KEY}=1; expires=1 Jan 1970 00:00:00 GMT;`;
});

it("logins a user and redirects to the dashboard page", async () => {
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/users/auth") {
        return {
          ok: true,
          status: 200,
          json: async () => userAuthResponse,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="login" element={<UserLoginPage />} />
        <Route path="user-area/dashboard" element={<h1>DashboardPage</h1>} />
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(emailInput, {
    target: { value: userAuthRequest["email"] },
  });
  fireEvent.change(passwordInput, {
    target: { value: userAuthRequest["password"] },
  });

  await user.click(
    screen.getByRole("button", {
      name: /Login/i,
    })
  );

  const dashboard = screen.getByText("DashboardPage");
  expect(dashboard).toBeInTheDocument();
});

it("displays validation error when user input does not meet server constraints", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/users/auth") {
        return {
          ok: false,
          status: 400,
          json: async () => validationErrors,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="login" element={<UserLoginPage />} />
        <Route path="user-area/dashboard" element={<h1>DashboardPage</h1>} />
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(emailInput, {
    target: { value: "invalidEmail" },
  });
  fireEvent.change(passwordInput, {
    target: { value: userAuthRequest["password"] },
  });

  await user.click(
    screen.getByRole("button", {
      name: /Login/i,
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
      if (url === "/api/users/auth") {
        return {
          ok: false,
          status: 500,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="login" element={<UserLoginPage />} />
        <Route path="user-area/dashboard" element={<h1>DashboardPage</h1>} />
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(emailInput, {
    target: { value: userAuthRequest["email"] },
  });
  fireEvent.change(passwordInput, {
    target: { value: userAuthRequest["password"] },
  });

  await user.click(
    screen.getByRole("button", {
      name: /Login/i,
    })
  );

  const message = await screen.findByText(
    /Server error. Please try again later./i
  );
  expect(message).toBeInTheDocument();
});
