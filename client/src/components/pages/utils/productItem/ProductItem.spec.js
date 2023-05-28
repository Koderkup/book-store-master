import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductItem from "./ProductItem";
import { GlobalState } from "../../../../GlobalState";
import { MemoryRouter } from "react-router-dom";

const product = {
  _id: "1",
  title: "Test Product",
  price: 100,
  quantity: 5,
  author: "Test Author",
  description: "Test Description",
  images: {
    url: "test-image.jpg",
    public_id: "test-public-id",
  },
  checked: false,
};
const state = {
  userAPI: {
    isLogged: [false],
    isAdmin: [true],
  },
  productsAPI: {
    products: [],
    callback: () => {},
    token: "test-token",
  },
};
describe("ProductItem component", () => {
  const deleteProduct = jest.fn();
  const handleCheck = jest.fn();
   const isAdmin = [true];

    it("renders product details correctly", () => {
      render(
        <GlobalState.Provider value={state}>
          <MemoryRouter initialEntries={["/"]}>
            <ProductItem
              product={product}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
              isAdmin={isAdmin}
            />
          </MemoryRouter>
        </GlobalState.Provider>
      );
      expect(screen.getByTitle("Test Product")).toBeInTheDocument();
      expect(screen.getByText("100 руб")).toBeInTheDocument();
      expect(screen.getByText("кол-во 5 шт")).toBeInTheDocument();
      expect(screen.getByText("Test Author")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
      expect(screen.getByAltText("")).toHaveAttribute("src", "test-image.jpg");
    });

    it("renders 'нет в наличии' when product quantity is 0", () => {
      const outOfStockProduct = { ...product, quantity: 0 };
     render(
       <GlobalState.Provider value={state}>
         <MemoryRouter initialEntries={["/"]}>
           <ProductItem
             product={outOfStockProduct}
             deleteProduct={deleteProduct}
             handleCheck={handleCheck}
             isAdmin={isAdmin}
           />
         </MemoryRouter>
       </GlobalState.Provider>
     );
      expect(screen.getByText("нет в наличии")).toBeInTheDocument();
      expect(screen.queryByText("кол-во 0 шт")).not.toBeInTheDocument();
    });

    it("renders checkbox when isAdmin prop is true", () => {
      render(
        <GlobalState.Provider value={state}>
          <MemoryRouter initialEntries={["/"]}>
            <ProductItem
              product={product}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
              isAdmin={isAdmin}
            />
          </MemoryRouter>
        </GlobalState.Provider>
      );
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("does not render checkbox when isAdmin prop is false", () => {
      const isAdmin = false;
     render(
       <GlobalState.Provider value={state}>
         <MemoryRouter initialEntries={["/"]}>
           <ProductItem
             product={product}
             deleteProduct={deleteProduct}
             handleCheck={handleCheck}
             isAdmin={isAdmin}
           />
         </MemoryRouter>
       </GlobalState.Provider>
     );
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

  it("calls handleCheck function when checkbox is clicked", () => {
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/"]}>
          <ProductItem
            product={product}
            deleteProduct={deleteProduct}
            handleCheck={handleCheck}
            isAdmin={isAdmin}
          />
        </MemoryRouter>
      </GlobalState.Provider>
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(handleCheck).toHaveBeenCalledWith("1");
  });

  it("calls deleteProduct function when delete button is clicked", () => {
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/"]}>
          <ProductItem
            product={product}
            deleteProduct={deleteProduct}
            isAdmin={isAdmin}
          />
        </MemoryRouter>
      </GlobalState.Provider>
    );
    const deleteButton = screen.getByText("Удалить");
    fireEvent.click(deleteButton);
    expect(deleteProduct).toHaveBeenCalledWith("1", "test-public-id");
  });
});
