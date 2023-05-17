// import React from "react";
// import { render, fireEvent, waitFor, screen } from "@testing-library/react";
// import axios from "axios";
// import Cart from "./Cart";
// import { GlobalState } from "../../../GlobalState";


// describe("Cart component", () => {
//     const state = {
//       userAPI: {
//         cart: [[], jest.fn()],
//         email: ["", jest.fn()],
//       },
//       token: ["", jest.fn()],
//     };
//   jest.mock("react-leaflet", () => ({
//     // Mock the MapContainer component
//     MapContainer: jest
//       .fn()
//       .mockImplementation(({ children }) => <div>{children}</div>),
//   }));

//   const mockFetch = jest.fn(() => Promise.resolve({}));
//   it('renders "Корзина пустая" message when cart is empty', () => {
    
//     render(<Cart />, {
//       wrapper: ({ children }) => (
//         <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
//       ),
//     });
//     expect(screen.getByText("Корзина пустая")).toBeInTheDocument();
//   });

//   test("renders cart component", () => {
//     render(<Cart />, {
//       wrapper: ({ children }) => (
//         <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
//       ),
//     });
//     const cartElement = screen.getByTestId("cart");
//     expect(cartElement).toBeInTheDocument();
//   });

//   it("renders products in cart", () => {
//     const cart = [
//       {
//         _id: "1",
//         title: "Product 1",
//         price: 100,
//         quantity: 2,
//         images: {
//           url: "https://example.com/product1.jpg",
//         },
//         description: "Description 1",
//         author: "Author 1",
//       },
//       {
//         _id: "2",
//         title: "Product 2",
//         price: 50,
//         quantity: 1,
//         images: {
//           url: "https://example.com/product2.jpg",
//         },
//         description: "Description 2",
//         author: "Author 2",
//       },
//     ];
//     const state = {
//       userAPI: {
//         cart: [cart, jest.fn()],
//         email: ["", jest.fn()],
//       },
//       token: ["", jest.fn()],
//     };
//     render(<Cart />, {
//       wrapper: ({ children }) => (
//         <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
//       ),
//     });
//     expect(screen.getByText("Product 1")).toBeInTheDocument();
//     expect(screen.getByText("Product 2")).toBeInTheDocument();
//     expect(screen.getByText("руб 200")).toBeInTheDocument();
//     expect(screen.getByText("руб 50")).toBeInTheDocument();
//   });

//   it('removes product from cart when "X" button is clicked', () => {
//     const cart = [
//       {
//         _id: "1",
//         title: "Product 1",
//         price: 100,
//         quantity: 2,
//         images: {
//           url: "https://example.com/product1.jpg",
//         },
//         description: "Description 1",
//         author: "Author 1",
//       },
//       {
//         _id: "2",
//         title: "Product 2",
//         price: 50,
//         quantity: 1,
//         images: {
//           url: "https://example.com/product2.jpg",
//         },
//         description: "Description 2",
//         author: "Author 2",
//       },
//     ];
//     const state = {
//       userAPI: {
//         cart: [cart, jest.fn()],
//         email: ["", jest.fn()],
//       },
//       token: ["", jest.fn()],
//     };
//     render(<Cart />, {
//       wrapper: ({ children }) => (
//         <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
//       ),
//     });
//     fireEvent.click(screen.getAllByText("X")[0]);
//     expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
//     expect(screen.getByText("Product 2")).toBeInTheDocument();
//     expect(screen.getByText("руб 50")).toBeInTheDocument();
//   });

//   it('increases quantity of product when "+" button is clicked', () => {
//     const cart = [
//       {
//         _id: "1",
//         title: "Product 1",
//         price: 100,
//         quantity: 2,
//         images: {
//           url: "https://example.com/product1.jpg",
//         },
//         description: "Description 1",
//         author: "Author 1",
//       },
//     ];
//     const state = {
//       userAPI: {
//         cart: [cart, jest.fn()],
//         email: ["", jest.fn()],
//       },
//       token: ["", jest.fn()],
//     };
//     render(<Cart />, {
//       wrapper: ({ children }) => (
//         <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
//       ),
//     });
//     fireEvent.click(screen.getAllByText("+")[0]);
//     expect(screen.getByText("руб 300")).toBeInTheDocument();
//     expect(screen.getByText("3")).toBeInTheDocument();
//   });

//   it('decreases quantity of product when "-" button is clicked', () => {
//     const cart = [
//       {
//         _id: "1",
//         title: "Product 1",
//         price: 100,
//         quantity: 2,
//         images: {
//           url: "https://example.com/product1.jpg",
//         },
//         description: "Description 1",
//         author: "Author 1",
//       },
//     ];
//     const state = {
//       userAPI: {
//         cart: [cart, jest.fn()],
//         email: ["", jest.fn()],
//       },
//       token: ["", jest.fn()],
//     };
//     render(<Cart />, {
//       wrapper: ({ children }) => (
//         <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
//       ),
//     });
//     fireEvent.click(screen.getAllByText("-")[0]);
//     expect(screen.getByText("руб 100")).toBeInTheDocument();
//     expect(screen.getByText("1")).toBeInTheDocument();
//   });

//   it("sends form data when form is submitted", async () => {
//     global.fetch = mockFetch;
//     const cart = [
//       {
//         _id: "1",
//         title: "Product 1",
//         price: 100,
//         quantity: 2,
//         images: {
//           url: "https://example.com/product1.jpg",
//         },
//         description: "Description 1",
//         author: "Author 1",
//       },
//     ];
//     const state = {
//       userAPI: {
//         cart: [cart, jest.fn()],
//         email: ["", jest.fn()],
//       },
//       token: ["", jest.fn()],
//     };
//     render(<Cart />, {
//       wrapper: ({ children }) => (
//         <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
//       ),
//     });
//     fireEvent.click(screen.getAllByText("Оплатить по QR Code")[0]);
//     fireEvent.change(screen.getByPlaceholderText("введите номер платежа"), {
//       target: { value: "123456" },
//     });
//     fireEvent.change(screen.getByPlaceholderText("email для обратной связи"), {
//       target: { value: "test@example.com" },
//     });
//     fireEvent.change(
//       screen.getByPlaceholderText(
//         "напишите адрес и предпочтительное время доставки"
//       ),
//       { target: { value: "Address" } }
//     );
//     fireEvent.submit(screen.getByRole("form"));
//     await screen.findByText("Корзина пустая");
//     expect(mockFetch).toHaveBeenCalledWith("http://localhost:5000/email", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json;charset=utf-8",
//       },
//       body: JSON.stringify({
//         pay_number: "123456",
//         email: "test@example.com",
//         message: "Address",
//       }),
//     });
//   });
// });
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Cart from "./Cart";
import { GlobalState } from "../../../GlobalState";
 import { MapContainer } from "react-leaflet";
// Mock GlobalState
jest.mock("../../../GlobalState", () => ({
  GlobalState: {
    userAPI: {
      cart: [[{_id: "1", title: "test product", price: 100, quantity: 2}]],
      email: ["test@example.com"],
    },
    token: ["testToken"],
  },
}));

// Mock axios
jest.mock("axios");

describe("Cart component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders Cart component with products in cart", () => {
    render(<Cart />);
    
    // Check that component renders products from cart
    const productTitle = screen.getByText(/test product/i);
    expect(productTitle).toBeInTheDocument();
    
    // Check that total price is correctly calculated
    const totalPrice = screen.getByText("руб 200");
    expect(totalPrice).toBeInTheDocument();

    // Check that increment button increases quantity
    const incrementBtn = screen.getByText("+");
    fireEvent.click(incrementBtn);
    const updatedQuantity = screen.getByText("3");
    expect(updatedQuantity).toBeInTheDocument();

    // Check that decrement button decreases quantity
    const decrementBtn = screen.getByText("-");
    fireEvent.click(decrementBtn);
    const updatedQuantity2 = screen.getByText("2");
    expect(updatedQuantity2).toBeInTheDocument();

    // Check that product can be removed from cart
    const removeBtn = screen.getByText("X");
    fireEvent.click(removeBtn);
    expect(productTitle).not.toBeInTheDocument();
  });

  test("Renders Cart component with empty cart", () => {
    // Set cart to empty array
    GlobalState.userAPI.cart = [[]];

    render(<Cart />);
    
    // Check that "Cart is empty" text is displayed
    const emptyCartText = screen.getByText(/корзина пустая/i);
    expect(emptyCartText).toBeInTheDocument();

    // Check that other elements do not render
    const productTitle = screen.queryByText(/test product/i);
    expect(productTitle).not.toBeInTheDocument();

    const totalPrice = screen.queryByText("руб 200");
    expect(totalPrice).not.toBeInTheDocument();
  });

  test("Calculates correct total price", () => {
    render(<Cart />);
    
    // Check that total price is correctly calculated
    const totalPrice = screen.getByText("руб 200");
    expect(totalPrice).toBeInTheDocument();
  });

  test("Increments quantity of product", async () => {
    render(<Cart />);
    
    // Check that quantity is initially 2
    const initialQuantity = screen.getByText("2");
    expect(initialQuantity).toBeInTheDocument();

    // Increment quantity
    const incrementBtn = screen.getByText("+");
    fireEvent.click(incrementBtn);

    // Wait for component to update
    await waitFor(() => {
      const updatedQuantity = screen.getByText("3");
      expect(updatedQuantity).toBeInTheDocument();
    });
  });

  test("Decrements quantity of product", async () => {
    render(<Cart />);
    
    // Check that quantity is initially 2
    const initialQuantity = screen.getByText("2");
    expect(initialQuantity).toBeInTheDocument();

    // Decrement quantity
    const decrementBtn = screen.getByText("-");
    fireEvent.click(decrementBtn);

    // Wait for component to update
    await waitFor(() => {
      const updatedQuantity = screen.getByText("1");
      expect(updatedQuantity).toBeInTheDocument();
    });
  });

  test("Removes product from cart", async () => {
    render(<Cart />);
    
    // Check that product is initially displayed
    const productTitle = screen.getByText(/test product/i);
    expect(productTitle).toBeInTheDocument();

    // Remove product
    const removeBtn = screen.getByText("X");
    fireEvent.click(removeBtn);

    // Wait for component to update
    await waitFor(() => {
      expect(productTitle).not.toBeInTheDocument();
    });
    });
    });