import React from "react";
import {
  render,
  screen,
  fireEvent
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Products from "./Products";
import { GlobalState } from "../../../GlobalState";

jest.mock("axios");

jest.mock("./Filters", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="filters" />;
  },
}));

jest.mock("./LoadMore", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="load-more" />;
  },
}));

jest.mock("../utils/loading/Loading", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="Loading" />;
  },
}));
describe("Products component", () => {
  let wrapper;
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

  const state = {
    categoriesAPI: {
      categories: mockCategories,
    },
    userAPI: {
      isLogged: [false],
      isAdmin: [true],
    },
    productsAPI: {
      products: [mockProducts, jest.fn()],
      callback: [false, jest.fn()],
      category: mockCategories,
      sort: ["mock-sort", jest.fn()],
      search: ["mock-search", jest.fn()],
      page: [1, jest.fn()],
      result: [0, jest.fn()],
    },
    token: "test-token",
  };

  beforeEach(() => {
    wrapper = (
      <GlobalState.Provider value={state}>
        <MemoryRouter>
          <Products />
        </MemoryRouter>
      </GlobalState.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Filters component", () => {
    render(wrapper);
    expect(screen.getByTestId("filters")).toBeInTheDocument();
  });

  it("renders LoadMore component", () => {
    render(wrapper);
    expect(screen.getByTestId("load-more")).toBeInTheDocument();
  });

  it("renders ProductItem components равный количеству of products", () => {
    render(wrapper);
    const productItems = screen.getAllByText(/Изменить/i);
    expect(productItems.length).toBe(2);
  });

  it("вызов deleteProduct function по клику кнопки удалить на ProductItem component", async () => {
    const mockResponse = { data: { msg: "Product deleted" } };
    axios.post.mockResolvedValueOnce(mockResponse);
    axios.delete.mockResolvedValueOnce(mockResponse);
    render(wrapper);
    fireEvent.click(screen.getAllByText("Удалить")[0]);
    expect(axios.post).toHaveBeenCalledWith(
      "/api/destroy",
      { public_id: "1" },
      { headers: { Authorization: "t" } }
    );
    expect(axios.delete).toHaveBeenCalledWith("/api/products/1", {
      headers: { Authorization: "t" },
    });
  });

    it('вызов deleteAll function по клику delete all кнопки', async () => {
      const mockDeleteProduct = jest.fn();
      Products.prototype.deleteProduct = mockDeleteProduct;

      const mockResponse = { data: { msg: 'Product deleted' } };
      axios.post.mockResolvedValueOnce(mockResponse);
      axios.delete.mockResolvedValueOnce(mockResponse);

      render(wrapper);

      fireEvent.click(screen.getByTestId('select-all'));
      fireEvent.click(screen.getByTestId('delete-all'));

      expect(axios.post).toHaveBeenCalledWith(
        '/api/destroy',
        { public_id: '1' },
        { headers: { Authorization: 't' } }
      );

      expect(axios.delete).toHaveBeenCalledWith('/api/products/1', {
        headers: { Authorization: 't' },
      });
      expect(axios.delete).toHaveBeenCalledTimes(2);
    });
});
