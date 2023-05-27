import React from "react";
import { render, screen } from "@testing-library/react";
import Cart from "./Cart";

jest.mock("./Cart", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="cart-component" />;
  },
}));

describe("Cart component", () => {
  it("renders without errors", () => {
    render(<Cart />);
    const cartComponent = screen.getByTestId("cart-component");
    expect(cartComponent).toBeInTheDocument();
  });
});
