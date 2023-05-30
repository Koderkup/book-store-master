import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Reviews from "./Reviews";
import { GlobalState } from "../../GlobalState";

jest.mock("./Pagination", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="pagination" />;
  },
}));

jest.mock("axios");

describe("Reviews component", () => {
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
      categories: [mockCategories],
      callback: [false, jest.fn()],
    },
    userAPI: {
      isLogged: [true],
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
          <Reviews />
        </MemoryRouter>
      </GlobalState.Provider>
    );
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders Reviews component", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          product: { title: "Book 1" },
          text: "Review 1",
          rating: 5,
          author: "Василий1",
          createdAt: "2022-01-01T00:00:00.000Z",
        },
        {
          _id: "2",
          product: { title: "Book 2" },
          text: "Review 2",
          rating: 4,
          author: "Василий2",
          createdAt: "2022-01-02T00:00:00.000Z",
        },
      ],
    });
    render(wrapper);
    const reviewsTitle = screen.getByText("Отзывы покупателей");
    expect(reviewsTitle).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText("Поиск по названию книги");
    expect(searchInput).toBeInTheDocument();
    const pagination = screen.getByTestId("pagination");
    expect(pagination).toBeInTheDocument();
    await screen.findByText("Book 1");
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText(/Review\s+1/)).toBeInTheDocument();
    expect(screen.getByText("Василий1", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("✯✯✯✯✯")).toBeInTheDocument();
    expect(
      screen.getByText("2022-01-01", { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText("Book 2")).toBeInTheDocument();
    expect(screen.getByText(/Review\s+2/)).toBeInTheDocument();
    expect(screen.getByText("Василий2", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("✯✯✯✯")).toBeInTheDocument();
    expect(
      screen.getByText("2022-01-02", { exact: false })
    ).toBeInTheDocument();
  });

  it("searches reviews by book title", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          product: { title: "Book 1" },
          text: "Review 1",
          rating: 5,
          author: "Василий1",
          createdAt: "2022-01-01T00:00:00.000Z",
        },
        {
          _id: "2",
          product: { title: "Book 2" },
          text: "Review 2",
          rating: 4,
          author: "Василий2",
          createdAt: "2022-01-02T00:00:00.000Z",
        },
      ],
    });
    render(wrapper);
    const searchInput = screen.getByPlaceholderText("Поиск по названию книги");
    fireEvent.change(searchInput, { target: { value: "book 1" } });
    await screen.findByText("Book 1");
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText(/Review\s+1/)).toBeInTheDocument();
    expect(screen.getByText("Василий1", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("✯✯✯✯✯")).toBeInTheDocument();
    expect(
      screen.getByText("2022-01-01", { exact: false })
    ).toBeInTheDocument();
    expect(screen.queryByText("Book 2")).not.toBeInTheDocument();
    expect(screen.queryByText(/Review\s+2/)).not.toBeInTheDocument();
    expect(
      screen.queryByText("Василий2", { exact: false })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("✯✯✯✯")).not.toBeInTheDocument();
    expect(
      screen.queryByText("2022-01-02", { exact: false })
    ).not.toBeInTheDocument();
  });

  it("deletes a review", async () => {
    const reviewId = "1";
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          product: { title: "Book 1" },
          text: "Review 1",
          rating: 5,
          author: "Василий1",
          createdAt: "2022-01-01T00:00:00.000Z",
        },
        {
          _id: "2",
          product: { title: "Book 2" },
          text: "Review 2",
          rating: 4,
          author: "Василий2",
          createdAt: "2022-01-02T00:00:00.000Z",
        },
      ],
    });
    axios.delete.mockResolvedValueOnce({});
    render(wrapper);
    await screen.findByText("Book 1");
    const deleteButton = screen.getAllByText("Удалить")[0];
    fireEvent.click(deleteButton);
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(`api/reviews/${reviewId}`, {
      headers: {
        Authorization: "t",
      },
    });
    await waitFor(() => {
      expect(screen.queryByText("Book 1")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Review 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Василий1")).not.toBeInTheDocument();
    expect(screen.queryByText("✯✯✯✯✯")).not.toBeInTheDocument();
    expect(screen.queryByText("2022-01-01")).not.toBeInTheDocument();
  });

  it("bans a user", async () => {
    const reviewId = "1";
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          product: { title: "Book 1" },
          text: "Review 1",
          rating: 5,
          author: "Василий1",
          createdAt: "2022-01-01T00:00:00.000Z",
        },
      ],
    });
    axios.post.mockResolvedValueOnce({
      data: [
        {
          _id: reviewId,
          product: { title: "Book 1" },
          text: "Review 1",
          rating: 5,
          author: "Василий1",
          createdAt: "2022-01-01T00:00:00.000Z",
          isUserBanned: true,
        },
      ],
    });
    render(wrapper);
    await screen.findByText("Book 1");
    const banButton = screen.getByText("Забанить");
    fireEvent.click(banButton);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "api/reviews/ban-user",
      { reviewId, userId: undefined },
      {
        headers: {
          Authorization: "t",
        },
      }
    );
  });
});
