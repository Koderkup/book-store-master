import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import CreateProduct from "./CreateProduct";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
jest.mock("axios");

describe("CreateProduct component", () => {
  const initialState = {
    product_id: "",
    title: "",
    price: 0,
    description: "интересная книга",
    author: "Достоевский Ф.М.",
    category: "",
    quantity: 1,
    _id: "",
  };

  const mockCategories = [
    { _id: "1", name: "Категория 1" },
    { _id: "2", name: "Категория 2" },
  ];

  const mockProducts = [
    {
      _id: "1",
      product_id: "123",
      title: "Товар 1",
      price: 100,
      description: "Описание товара 1",
      author: "Автор 1",
      category: "1",
      quantity: 10,
      images: { url: "http://example.com/image.jpg", public_id: "1" },
    },
    {
      _id: "2",
      product_id: "456",
      title: "Товар 2",
      price: 200,
      description: "Описание товара 2",
      author: "Автор 2",
      category: "2",
      quantity: 20,
      images: { url: "http://example.com/image2.jpg", public_id: "2" },
    },
  ];

  const mockState = {
    categoriesAPI: {
      categories: [mockCategories],
    },
    productsAPI: {
      products: [mockProducts],
      callback: [false, jest.fn()],
    },
    userAPI: {
      isAdmin: [true],
    },
    token: ["mock_token"],
  };

  it("renders without errors", () => {
    render(
      <GlobalState.Provider value={mockState}>
        <MemoryRouter initialEntries={["/create_product"]}>
          <CreateProduct />
        </MemoryRouter>
      </GlobalState.Provider>
    );
    const createProductComponent = screen.getByTestId(
      "create-product-component"
    );
    expect(createProductComponent).toBeInTheDocument();
  });

  it("updates product state on input change", () => {
    render(
      <GlobalState.Provider value={mockState}>
        <MemoryRouter initialEntries={["/create_product"]}>
          <CreateProduct />
        </MemoryRouter>
      </GlobalState.Provider>
    );
    const title_input = screen.getByLabelText("Название");
    fireEvent.change(title_input, { target: { value: "Новое название" } });
    expect(title_input.value).toBe("Новое название");

    axios.post.mockResolvedValue({
      data: {
        success: true,
      },
    });
    const handleSubmit = jest.fn();
    const handleChangeInput = jest.fn();
    render(
      <GlobalState.Provider value={mockState}>
        <MemoryRouter initialEntries={["/create_product"]}>
          <CreateProduct onSubmit={handleSubmit} />
        </MemoryRouter>
      </GlobalState.Provider>
    );
    const titleInput = screen.getByRole("textbox", { name: /название/i });
    const priceInput = screen.getByRole("spinbutton", { name: /цена/i });
    const descriptionInput = screen.getByRole("textbox", { name: /описание/i });
    const authorInput = screen.getByRole("textbox", { name: /автор/i });
    const quantityInput = screen.getByRole("spinbutton", { name: /кол-во/i });
    userEvent.clear(titleInput);
    userEvent.type(titleInput, "Тестовое название");
    expect(titleInput.value).toBe("Тестовое название");
    userEvent.clear(priceInput);
    userEvent.type(priceInput, "100", { allAtOnce: true });
    expect(priceInput.value).toBe("100");
    userEvent.clear(descriptionInput);
    userEvent.type(descriptionInput, "Тестовое описание");
    expect(descriptionInput.value).toBe("Тестовое описание");
    userEvent.clear(authorInput);
    userEvent.type(authorInput, "Тестовый автор");
    expect(authorInput.value).toBe("Тестовый автор");
    userEvent.clear(quantityInput);
    userEvent.type(quantityInput, "1");
    expect(quantityInput.value).toBe("1");
  });
});
