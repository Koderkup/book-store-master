import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";
import axios from "axios";
import { act } from "react-test-renderer";

jest.mock("axios"); // мокаем axios
describe("Register component", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders registration form", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByTestId("registration-form")).toBeInTheDocument();
  });

  it("updates user state when input value changes", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(nameInput, { target: { value: "Иван" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    expect(nameInput.value).toBe("Иван");
    expect(emailInput.value).toBe("john@example.com");
    expect(passwordInput.value).toBe("secret");
  });

    it("submits registration form", async () => {
      const postMock = jest.spyOn(axios, "post").mockResolvedValueOnce();
      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );
      const nameInput = screen.getByPlaceholderText("Name");
      const emailInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByText("Регистрация");

      fireEvent.change(nameInput, { target: { value: "Иван" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "secret" } });
      fireEvent.click(submitButton);

      expect(postMock).toHaveBeenCalledWith("/user/register", {
        name: "Иван",
        email: "john@example.com",
        password: "secret",
      });
await waitFor(() => {
  expect(window.location.pathname).toBe("/");
});
      postMock.mockRestore();
    });
});
