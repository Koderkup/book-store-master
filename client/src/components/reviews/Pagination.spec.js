import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Pagination from "./Pagination";

describe("Pagination component", () => {
  const reviewsPerPage = 5;
  const totalReviews = 20;
  const paginate = jest.fn();
  const prevPage = jest.fn();
  const nextPage = jest.fn();
  const currentPage = 1;

  it("renders the component with correct number of pages", () => {
    render(
      <MemoryRouter>
        <Pagination
          reviewsPerPage={reviewsPerPage}
          totalReviews={totalReviews}
          paginate={paginate}
          prevPage={prevPage}
          nextPage={nextPage}
          currentPage={currentPage}
        />
      </MemoryRouter>
    );

    const pageItems = screen.getAllByRole("listitem");
    expect(pageItems).toHaveLength(6); // 4 pages + prev and next buttons
  });

  it("calls the paginate function when a page link is clicked", () => {
    render(
      <MemoryRouter>
        <Pagination
          reviewsPerPage={reviewsPerPage}
          totalReviews={totalReviews}
          paginate={paginate}
          prevPage={prevPage}
          nextPage={nextPage}
          currentPage={currentPage}
        />
      </MemoryRouter>
    );

    const pageLink = screen.getByText("2");
    fireEvent.click(pageLink);
    expect(paginate).toHaveBeenCalledWith(2);
  });

  it("calls the prevPage function when the previous button is clicked", () => {
    render(
      <MemoryRouter>
        <Pagination
          reviewsPerPage={reviewsPerPage}
          totalReviews={totalReviews}
          paginate={paginate}
          prevPage={prevPage}
          nextPage={nextPage}
          currentPage={currentPage}
        />
      </MemoryRouter>
    );

    const prevButton = screen.getByText("⇐");
    fireEvent.click(prevButton);
    expect(prevPage).toHaveBeenCalled();
  });

  it("calls the nextPage function when the next button is clicked", () => {
    render(
      <MemoryRouter>
        <Pagination
          reviewsPerPage={reviewsPerPage}
          totalReviews={totalReviews}
          paginate={paginate}
          prevPage={prevPage}
          nextPage={nextPage}
          currentPage={currentPage}
        />
      </MemoryRouter>
    );

    const nextButton = screen.getByText("⇒");
    fireEvent.click(nextButton);
    expect(nextPage).toHaveBeenCalled();
  });
});
