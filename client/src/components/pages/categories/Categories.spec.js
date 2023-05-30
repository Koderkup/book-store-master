import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Categories from "./Categories";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";

jest.mock("axios"); // мокаем axios


describe("Categories component", () => {
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

    const products = [
      { _id: "1", name: "Product 1", checked: true },
      { _id: "2", name: "Product 2", checked: false },
    ];

    const state = {
      categoriesAPI: {
        categories: [mockCategories],
        callback: [false, jest.fn()],
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
      token: "t",
    };

  beforeEach(() => {
    wrapper = (
      <GlobalState.Provider value={state}>
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      </GlobalState.Provider>
    );
    axios.put.mockResolvedValue({ data: { msg: "Категория обновлена" } });
    axios.post.mockResolvedValue({ data: { msg: "Категория создана" } });
    axios.delete.mockResolvedValue({ data: { msg: "Категория удалена" } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(wrapper);
  });

  it("creates a new category", async () => {
    render(wrapper);
    fireEvent.change(screen.getByLabelText("Категория"), {
      target: { value: "Test" },
    });
    fireEvent.click(screen.getByText("Создать"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/category",
        { name: "Test" },
        { headers: { Authorization: "t" } }
      );
    });
  });

  it("updates an existing category", async () => {
     render(wrapper);
    fireEvent.click(screen.getAllByText("Редактировать")[0]);
    fireEvent.change(screen.getByLabelText("Категория"), {
      target: { value: "UpdatedCategory" },
    });
    fireEvent.click(screen.getByText("Обновить"));
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `/api/category/1`,
        { name: "UpdatedCategory" },
        { headers: { Authorization: "t" } }
      );
    });
  });

  it("deletes a category", async () => {
    render(wrapper);
    fireEvent.click(screen.getAllByText("Удалить")[0]);
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(`/api/category/1`, {
        headers: { Authorization: "t" },
      });
    });
  });
});
