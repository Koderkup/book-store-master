import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import DetailProduct from "./DetailProduct";

const mockProducts = [
  {
    _id: "1",
    title: "Product 1",
    images: { url: "image1.jpg" },
    price: 100,
    description: "Description 1",
    author: "Author 1",
    sold: 5,
    quantity: 10,
    category: "category1",
  },
  {
    _id: "2",
    title: "Product 2",
    images: { url: "image2.jpg" },
    price: 200,
    description: "Description 2",
    author: "Author 2",
    sold: 3,
    quantity: 0,
    category: "category1",
  },
  {
    _id: "3",
    title: "Product 3",
    images: { url: "image3.jpg" },
    price: 300,
    description: "Description 3",
    author: "Author 3",
    sold: 8,
    quantity: 5,
    category: "category2",
  },
];

const mockState = {
  productsAPI: {
    products: mockProducts,
  },
  userAPI: {
    addCart: jest.fn(),
  },
  detailProduct: mockProducts[0],
};

const detailProduct = [
  {
    _id: "1",
    title: "Product 1",
    images: { url: "image1.jpg" },
    price: 100,
    description: "Description 1",
    author: "Author 1",
    sold: 5,
    quantity: 10,
    category: "category1",
  },
];


describe("DetailProduct component", () => {
  it("renders without crashing", () => {
    render(
      <GlobalState.Provider value={mockState}>
        <Router>
          <DetailProduct />
        </Router>
      </GlobalState.Provider>
    );
    const detailComponent = screen.getByText("...Loading");
    expect(detailComponent).toBeInTheDocument();
  });
});
