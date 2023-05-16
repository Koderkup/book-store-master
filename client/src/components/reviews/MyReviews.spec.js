import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MyReviews from "./MyReviews";
import { GlobalState } from "../../GlobalState";

describe("MyReviews component", () => {
  jest.mock("axios");

  const mockReviews = [
    {
      _id: "1",
      text: "Test review 1",
      rating: 4,
      product: { title: "Test Book 1" },
    },
    {
      _id: "2",
      text: "Test review 2",
      rating: 5,
      product: { title: "Test Book 2" },
    },
  ];

  const wrapper = ({ children }) => (
    <GlobalState.Provider
      value={{
        token: "t",
      }}
    >
      {children}
    </GlobalState.Provider>
  );

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockReviews });
  });

it("renders MyReviews without errors", () => {
  render(<MyReviews />, { wrapper });
  expect(screen.getByTestId("my-reviews")).toBeInTheDocument();
});

it("fetches and displays reviews", async () => {
  render(<MyReviews />, { wrapper });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledTimes(1);
     });
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("/api/my-reviews", {
          headers: { Authorization: "t" },
        });
      });

  mockReviews.forEach((review) => {
    expect(screen.getByText(review.product.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(review.text)).toBeInTheDocument();
    expect(screen.getByDisplayValue(review.rating.toString())).toBeInTheDocument();
  });
});

it("handles review text change", async () => {
  render(<MyReviews />, { wrapper });
  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledTimes(1);
     });
     await waitFor(() => {
       expect(axios.get).toHaveBeenCalledWith("/api/my-reviews", {
         headers: { Authorization: "t" },
       });
     });
  const textarea = screen.getByDisplayValue(mockReviews[0].text);
  fireEvent.change(textarea, { target: { value: "Updated review text" } });
  expect(textarea.value).toBe("Updated review text");
});

it("handles review rating change", async () => {
  render(<MyReviews />, { wrapper });
  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledTimes(1);
     });
     await waitFor(() => {
       expect(axios.get).toHaveBeenCalledWith("/api/my-reviews", {
         headers: { Authorization: "t" },
       });
     });

  const input = screen.getByDisplayValue(mockReviews[0].rating.toString());
  fireEvent.change(input, { target: { value: "3" } });
  expect(input.value).toBe("3");
});

it("handles review edit", async () => {
  axios.put.mockResolvedValue({ data: { ...mockReviews[0], text: "Updated review text", rating: 3 } });

  render(<MyReviews />, { wrapper });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("/api/my-reviews", {
      headers: { Authorization: "t" },
    });
  });

  const textarea = screen.getByDisplayValue(mockReviews[0].text);
  fireEvent.change(textarea, { target: { value: "Updated review text" } });

  const input = screen.getByDisplayValue(mockReviews[0].rating.toString());
  fireEvent.change(input, { target: { value: "3" } });

  const editButtons = screen.getAllByText("Редактировать");
  const editButton = editButtons[0];
  fireEvent.click(editButton);

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `/api/my-reviews/${mockReviews[0]._id}`,
        { text: "Updated review text", rating: "3" },
        { headers: { Authorization: "t" } }
      );
    });
});
});
