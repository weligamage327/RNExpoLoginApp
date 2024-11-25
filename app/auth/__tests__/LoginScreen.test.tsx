import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useLogin";
import LoginScreen from "@/screens/LoginScreen";

// Mock hooks
jest.mock("@/context/AuthContext");
jest.mock("@/hooks/useLogin");

// Mock functions
const mockLogin = jest.fn();
const mockLoginUser = jest.fn();

describe("LoginScreen", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (useLogin as jest.Mock).mockReturnValue({
      loginUser: mockLoginUser,
      loading: false,
      error: "",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("displays an error message if email is missing", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "");
    fireEvent.changeText(getByPlaceholderText("Password"), "password");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(getByText("Email is required.")).toBeTruthy();
    });
  });

  it("displays an error message if password is missing", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(getByText("Password is required.")).toBeTruthy();
    });
  });

  it("calls loginUser with correct credentials", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "john212@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith(
        "john212@test.com",
        "password",
        false // Assuming the Remember Me is unchecked
      );
    });
  });

  it("displays error message from the useLogin hook if login fails", async () => {
    (useLogin as jest.Mock).mockReturnValueOnce({
      loginUser: mockLoginUser,
      loading: false,
      error: "Login failed",
    });

    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(getByText("Login failed")).toBeTruthy();
    });
  });
});
