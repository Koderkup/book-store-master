import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import BtnRender from "./BtnRender";

describe("BtnRender component", () => {
  let state = {
    userAPI: {
      isAdmin: [false],
      addCart: jest.fn(),
    },
  };
 const deleteProductMock = jest.fn();
  beforeEach(() => {
    state = {
      userAPI: {
        isAdmin: [false],
        addCart: jest.fn(),
      },
    };
  });

  it("delete button should call deleteProduct function with correct arguments", () => {
    state.userAPI.isAdmin = [true];
    const product = {
      _id: "123",
      images: {
        public_id: "456",
      },
    };

    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/"]}>
          <BtnRender product={product} deleteProduct={deleteProductMock} />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    const deleteButton = screen.getByText("Удалить");
    fireEvent.click(deleteButton);

    expect(deleteProductMock).toHaveBeenCalledWith(
      product._id,
      product.images.public_id
    );
  });

  it("edit button should have correct link", () => {
     state.userAPI.isAdmin = [true];
    const product = {
      _id: "123",
    };

   render(
     <GlobalState.Provider value={state}>
       <MemoryRouter initialEntries={["/"]}>
         <BtnRender product={product} deleteProduct={deleteProductMock} />
       </MemoryRouter>
     </GlobalState.Provider>
   );

    const editButton = screen.getByText("Изменить");
    expect(editButton.getAttribute("href")).toEqual(
      `/edit_product/${product._id}`
    );
  });

  it("buy button should call addCart function with correct product", () => {
    const addCartMock = jest.fn();
    const product = {
      _id: "123",
      quantity: 1,
    };

    state.userAPI.addCart = addCartMock;

    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/"]}>
          <BtnRender product={product} deleteProduct={deleteProductMock} />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    const buyButton = screen.getByText("Купить");
    fireEvent.click(buyButton);

    expect(addCartMock).toHaveBeenCalledWith(product);
  });

  it("view button should have correct link", () => {
    const product = {
      _id: "123",
    };

    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/"]}>
          <BtnRender product={product} deleteProduct={deleteProductMock} />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    const viewButton = screen.getByText("Смотреть");
    expect(viewButton.getAttribute("href")).toEqual(`/detail/${product._id}`);
  });

  it("buy button should show alert when product is out of stock", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const product = {
      _id: "123",
      quantity: 0,
    };

    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/"]}>
          <BtnRender product={product} deleteProduct={deleteProductMock} />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    const buyButton = screen.getByText("Купить");
    fireEvent.click(buyButton);

    expect(alertMock).toHaveBeenCalledWith("нет в наличии");

    alertMock.mockRestore();
  });
});
