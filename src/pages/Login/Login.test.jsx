import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

const mockNavigate = jest.fn();

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ children, to, ...rest }) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

jest.mock("../../services/authService", () => ({
  loginUser: jest.fn(),
}));

jest.mock("../../services/profile", () => ({
  getProfile: jest.fn(),
}));

jest.mock("../../utils/auth", () => ({
  setAuth: jest.fn(),
}));

describe("Login page", () => {
  test("renders login form inputs, button and register link", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register here/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/email is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/password is required\./i)).toBeInTheDocument();
  });

  test("shows email validation error for invalid email", () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "not-an-email" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText(/please enter a valid email address\./i)
    ).toBeInTheDocument();
  });

  test("shows password validation error for short password", () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText(/password must be at least 8 characters\./i)
    ).toBeInTheDocument();
  });
});