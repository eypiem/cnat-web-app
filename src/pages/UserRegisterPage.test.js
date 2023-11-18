import { render, screen, fireEvent } from "@testing-library/react";
import UserRegisterPage from "./UserRegisterPage";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const userRegisterRequest = {
  firstName: "fn",
  lastName: "ln",
  email: "test1@test.com",
  password: "12345678",
};

const validationErrors = {
  validationErrors: [{ field: "Email", error: "Email format is not valid" }],
};

afterEach(() => {
  jest.restoreAllMocks();
});

it("registers a user and redirects to the login page", async () => {
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/users") {
        return {
          ok: true,
          status: 200,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="register" element={<UserRegisterPage />} />
        <Route path="login" element={<h1>LoginPage</h1>} />
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();
  const firstNameInput = screen.getByLabelText(/First Name/i);
  const lastNameInput = screen.getByLabelText(/Last Name/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(firstNameInput, {
    target: { value: userRegisterRequest["firstName"] },
  });
  fireEvent.change(lastNameInput, {
    target: { value: userRegisterRequest["lastName"] },
  });
  fireEvent.change(emailInput, {
    target: { value: userRegisterRequest["email"] },
  });
  fireEvent.change(passwordInput, {
    target: { value: userRegisterRequest["password"] },
  });

  await user.click(
    screen.getByRole("button", {
      name: /Register/i,
    })
  );

  const login = screen.getByText("LoginPage");
  expect(login).toBeInTheDocument();
});

it("displays validation error when user input does not meet server constraints", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  windowFetchSpy = jest
    .spyOn(window, "fetch")
    .mockImplementation(async (url) => {
      if (url === "/api/users") {
        return {
          ok: false,
          status: 400,
          json: async () => validationErrors,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="register" element={<UserRegisterPage />} />
        <Route path="login" element={<h1>Login Page</h1>} />
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();
  const firstNameInput = screen.getByLabelText(/First Name/i);
  const lastNameInput = screen.getByLabelText(/Last Name/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(firstNameInput, {
    target: { value: userRegisterRequest["firstName"] },
  });
  fireEvent.change(lastNameInput, {
    target: { value: userRegisterRequest["lastName"] },
  });
  fireEvent.change(emailInput, {
    target: { value: "invalidEmail" },
  });
  fireEvent.change(passwordInput, {
    target: { value: userRegisterRequest["password"] },
  });

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
      if (url === "/api/users") {
        return {
          ok: false,
          status: 500,
        };
      }
    });
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="register" element={<UserRegisterPage />} />
        <Route path="login" element={<h1>Login Page</h1>} />
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();
  const firstNameInput = screen.getByLabelText(/First Name/i);
  const lastNameInput = screen.getByLabelText(/Last Name/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);

  fireEvent.change(firstNameInput, {
    target: { value: userRegisterRequest["firstName"] },
  });
  fireEvent.change(lastNameInput, {
    target: { value: userRegisterRequest["lastName"] },
  });
  fireEvent.change(emailInput, {
    target: { value: userRegisterRequest["email"] },
  });
  fireEvent.change(passwordInput, {
    target: { value: userRegisterRequest["password"] },
  });

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
