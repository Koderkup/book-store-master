import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import { GlobalState } from "../../GlobalState";

jest.mock("axios");

const mockContext = {
  token: "test_token",
};
const mockValue = {
  author: "John Doe",
  rating: 4,
  text: "Awesome product!",
  product: "1",
  user: "2",
};
describe("ReviewForm", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  it("renders the form correctly", () => {
    render(
      <GlobalState.Provider value={mockContext}>
        <ReviewForm productId="1" userId="2" author="John Doe" />
      </GlobalState.Provider>
    );

    screen.getByLabelText("Имя:");
    screen.getByLabelText("Рейтинг:");
    screen.getByLabelText("Комментарий:");
    screen.getByText("Оставить отзыв");
  });

  it("handles rating change", () => {
    render(
      <GlobalState.Provider value={mockContext}>
        <ReviewForm productId="1" userId="2" author="John Doe" />
      </GlobalState.Provider>
    );

    const ratingSelect = screen.getByLabelText("Рейтинг:");
    fireEvent.change(ratingSelect, { target: { value: "3" } });
    expect(ratingSelect.value).toBe("3");
  });

  it("handles comment change", () => {
    render(
      <GlobalState.Provider value={mockContext}>
        <ReviewForm productId="1" userId="2" author="John Doe" />
      </GlobalState.Provider>
    );

    const commentTextarea = screen.getByLabelText("Комментарий:");
    fireEvent.change(commentTextarea, { target: { value: "Great product!" } });
    expect(commentTextarea.value).toBe("Great product!");
  });

  it("submits the form and clears inputs", async () => {
    axios.post.mockResolvedValue({});

    render(
      <GlobalState.Provider value={mockContext}>
        <ReviewForm productId="1" userId="2" author="John Doe" />
      </GlobalState.Provider>
    );

    const nameInput = screen.getByLabelText("Имя:");
    const ratingSelect = screen.getByLabelText("Рейтинг:");
    const commentTextarea = screen.getByLabelText("Комментарий:");
    const submitButton = screen.getByRole("button");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(ratingSelect, { target: { value: "4" } });
    fireEvent.change(commentTextarea, {
      target: { value: "Awesome product!" },
    });
    
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    expect(axios.post).toHaveBeenCalledWith("/api/reviews", mockValue, {
      headers: { Authorization: "t" },
    });
    await waitFor(() => {
      expect(nameInput.value).toBe("John Doe");
    });

    await waitFor(() => {
      expect(ratingSelect.value).toBe("");
    });

    await waitFor(() => {
      expect(commentTextarea.value).toBe("");
    });
  });

  it("handles API errors", async () => {
    axios.post.mockRejectedValue(new Error("API error"));
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;
    render(
      <GlobalState.Provider value={mockContext}>
        <ReviewForm productId="1" userId="2" author="John Doe" />
      </GlobalState.Provider>
    );

    const ratingSelect = screen.getByLabelText("Рейтинг:");
    const commentTextarea = screen.getByLabelText("Комментарий:");
    const submitButton = screen.getByRole("button");

    fireEvent.change(ratingSelect, { target: { value: "4" } });
    fireEvent.change(commentTextarea, {
      target: { value: "Awesome product!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(mockConsoleError).toHaveBeenCalled();
  });
});
