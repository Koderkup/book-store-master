import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import renderWithProviders from "../../components/pages/utils/renderWithProviders";


  jest.mock("../pages/auth/Login", () => ({
    __esModule: true,
    default: () => {
      return <div data-testid="registration-form">Login</div>;
    },
  }));

  jest.mock("../pages/auth/Register", () => ({
    __esModule: true,
    default: () => {
      return <div data-testid="registration-form" />;
    },
  }));


describe("Header", () => {
  
   let mockValueFalse = {
      userAPI: {
        isLogged: [false],
        isAdmin: [false],
        cart: [""],
        name: [""],
      },
    };

    let mockValueTrue = {
      userAPI: {
        isLogged: [true],
        isAdmin: [true],
        cart: [""],
        name: ["user"],
      },
    };

  it("renders Header component without crashing", () => {
    renderWithProviders(<Header />, mockValueFalse);
  });

  it("renders Header logo with correct text and link", () => {
    renderWithProviders(<Header />, mockValueFalse);
    const logoLink = screen.getByText(/Магазин книг/i);
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("opens menu on click on menu icon", () => {
    renderWithProviders(<Header />, mockValueFalse);
    fireEvent.click(screen.getByAltText("menu"));
    const menuItem = screen.getByText(/Магазин книг/i);
    expect(menuItem).toBeInTheDocument();
  });

  it("closes menu on click on close icon", () => {
    renderWithProviders(<Header />, mockValueFalse);
    fireEvent.click(screen.getByAltText("menu"));
    fireEvent.click(screen.getByAltText("close"));
    expect(screen.getByAltText("close")).toBeInTheDocument();
  });

  it('displays correct amount of items in cart', () => {
    renderWithProviders(<Header />, mockValueFalse);
    const cartCount = screen.getByText(/0/i);
    expect(cartCount).toBeInTheDocument();
  });

  it('correctly identifies if user is admin or not', () => {
    renderWithProviders(<Header />, mockValueTrue);
    const adminLink = screen.getByText(/admin/i);
    expect(adminLink).toBeInTheDocument();
  });

  // it('logs out user on click on logout button', async () => {
  //    jest.setTimeout(10000);
  //    renderWithProviders(<Header />, mockValueTrue);
  //    const logoutButton = screen.getByText((text) => text === /login/i);
  //    userEvent.click(logoutButton);
  //    await waitFor(() => {
  //      expect(screen.getByText(/login/i)).toBeInTheDocument();
  //    }); 
  // });

  it('displays correct menu items for admin', () => {
    renderWithProviders(<Header />, mockValueTrue);
    const createProductLink = screen.getByText(/создать товар/i);
    expect(createProductLink).toBeInTheDocument();
  });

  it('displays history link for logged in user', () => {
     renderWithProviders(<Header />, mockValueTrue);
    const historyLink = screen.getByText(/история/i);
    expect(historyLink).toBeInTheDocument();
  });

  it('opens login/register modal when clicking on login/register button', async () => {
    jest.setTimeout(10000);
    renderWithProviders(<Header />, mockValueFalse);
    const loginRegisterButton = screen.getByText(/login/i);
    userEvent.click(loginRegisterButton);
    await waitFor(
      () => {
        expect(window.location.pathname).toBe("/login");
        //expect(screen.getByTestId("registration-form")).toBeInTheDocument();
      }
    );
  });

  it("renders correct links for admin users", () => {
  renderWithProviders(<Header />, mockValueTrue);
    const createProductLink = screen.getByText(/Создать товар/i);
    const categoriesLink = screen.getByText(/Категории/i);
    expect(createProductLink).toBeInTheDocument();
    expect(categoriesLink).toBeInTheDocument();
  });

  it("cart icon is not visible for admin users", () => {
     renderWithProviders(<Header />, mockValueTrue);
    const cartIcon = screen.queryByAltText(/cart/i);
    expect(cartIcon).not.toBeInTheDocument();
  });

  it("mobile menu is toggled correctly", () => {
    renderWithProviders(<Header />, mockValueTrue);
    const menuButton = screen.getByAltText(/menu/i);
    fireEvent.click(menuButton);
    const mobileHeader = screen.getByTestId("mobile-header");
    expect(mobileHeader).toHaveStyle("left: 0");
  });

  it("displays logout link and hides login/register button after login", () => {
    renderWithProviders(<Header />, mockValueFalse);
    expect(screen.getByText("Login ✥ Register")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

});
