import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import axios from "axios";

jest.mock("axios"); // мокаем axios

describe("LoginForm component", () => {
  it("отображает форму логина", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    const registrationLink = screen.getByRole("link", { name: "Регистрация" });
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(registrationLink).toHaveAttribute("href", "/register");
  });
  it("ввод значений в поля формы логина", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    expect(emailInput.value).toBe("test@test.com");
    expect(passwordInput.value).toBe("testpassword");
  });
  it("отправка формы логина с корректными данными", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(loginButton);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/user/login", {
      email: "test@test.com",
      password: "testpassword",
    });
    await waitFor(() => {
      expect(localStorage.getItem("firstLogin")).toBe("true");
    });
    await waitFor(() => {
      expect(window.location.href).toBe("http://localhost/");
    });
  });

  it("обработка ошибок при отправке формы логина", async () => {
    localStorage.clear();
    const errorMessage = "Неверный email или пароль";
    jest.spyOn(window, "alert").mockImplementation(() => {});
    axios.post.mockRejectedValueOnce({
      response: { data: { msg: errorMessage } },
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(loginButton);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/user/login", {
      email: "test@test.com",
      password: "testpassword",
    });
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(errorMessage);
    });
    await waitFor(() => {
      expect(localStorage.getItem("firstLogin")).toBeNull();
    });
    await waitFor(() => {
      expect(window.location.href).toBe("http://localhost/");
    });
    jest.restoreAllMocks();
  });
});
