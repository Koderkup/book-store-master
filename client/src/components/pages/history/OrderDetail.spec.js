import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import OrderDetails from "./OrderDetails";
import { GlobalState } from "../../../GlobalState";

jest.mock("axios");

describe("OrderDetails component", () => {
  const mockHistory = [
    {
      _id: "1",
      name: "Test User",
      address: {
        postal_code: "12345",
        country_code: "BY",
      },
      cart: [
        {
          _id: "product1",
          title: "Product 1",
          images: {
            url: "https://example.com/product1.png",
          },
          quantity: 2,
          price: 10,
        },
        {
          _id: "product2",
          title: "Product 2",
          images: {
            url: "https://example.com/product2.png",
          },
          quantity: 1,
          price: 5,
        },
      ],
    },
  ];

  const mockState = {
    userAPI: {
      history: [mockHistory],
      isLogged: [true],
    },
  };

  beforeEach(() => {
    axios.post.mockClear();
  });
  it("displays order details", () => {
    render(
      <MemoryRouter initialEntries={["/history/1"]}>
        <GlobalState.Provider value={mockState}>
          <OrderDetails />
        </GlobalState.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("history page")).toBeInTheDocument();
  });
});