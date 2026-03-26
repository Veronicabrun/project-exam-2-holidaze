import { render, screen, fireEvent } from "@testing-library/react";
import Register from "./Register";

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
  registerUser: jest.fn(),
}));

describe("Register page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders register form inputs, checkbox, button and login link", () => {
    render(<Register />);

    expect(
      screen.getByRole("heading", { name: /create an account/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/register as venue manager/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /login here/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", () => {
    render(<Register />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText(/username is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/email is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/password is required\./i)).toBeInTheDocument();
  });

  test("shows username validation error for short username", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "Al" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "student@stud.noroff.no" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      screen.getByText(/username must be at least 3 characters\./i)
    ).toBeInTheDocument();
  });

  test("shows email validation error for non-stud.noroff.no email", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "Veronica" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      screen.getByText(/you must use a @stud\.noroff\.no email\./i)
    ).toBeInTheDocument();
  });

  test("shows password validation error for short password", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "Veronica" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "student@stud.noroff.no" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      screen.getByText(/password must be at least 8 characters\./i)
    ).toBeInTheDocument();
  });
});