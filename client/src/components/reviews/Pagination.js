import React from "react";
import { Link } from "react-router-dom";
const Pagination = ({
  reviewsPerPage,
  totalReviews,
  paginate,
  prevPage,
  nextPage,
  currentPage,
}) => {
  const pageNumber = [];

  for (
    let index = 1;
    index <= Math.ceil(totalReviews / reviewsPerPage);
    index++
  ) {
    pageNumber.push(index);
  }
  return (
    <div>
      <ul className="pagination">
        <li>
          {" "}
          <button className="choice-page" onClick={prevPage}>
            &lArr;
          </button>
        </li>
        {pageNumber.map((number) => (
          <li
            key={number}
            className={
              number === currentPage ? "page-item active" : "page-item"
            }
          >
            <Link
              to="#"
              onClick={() => {
                paginate(number);
              }}
            >
              {number}
            </Link>
          </li>
        ))}
        <li>
          <button className="choice-page" onClick={nextPage}>
            &rArr;
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
