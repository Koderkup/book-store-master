import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import axios from "axios";
import Pagination from "./Pagination";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filterText, setFilterText] = useState("");
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [reviewsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReviews = reviews.filter(
    ({ isUserBanned, product: { title } = {} }) =>
      !isUserBanned && title?.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredAdminReviews = reviews.filter(({ product }) =>
    product.title?.toLowerCase().includes(filterText.toLowerCase())
  );

  const lastReviewsIndex = currentPage * reviewsPerPage;
  const firstReviewsIndex = lastReviewsIndex - reviewsPerPage;

  const currentReviews = (
    isAdmin ? filteredAdminReviews : filteredReviews
  ).slice(firstReviewsIndex, lastReviewsIndex);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };
  const loadReviews = async () => {
    try {
      const response = await axios.get("api/reviews");
      const data = response.data;
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`api/reviews/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      // Обновляем список отзывов после удаления
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log(error.response.data);
      } else if (error.response && error.response.status === 400) {
        // проверяем, является ли ошибка ошибкой на сервере
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };

  const handleBanUser = async (reviewId, userId) => {
    try {
      const response = await axios.post(
        "api/reviews/ban-user",
        { reviewId, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const updatedReview = response.data;
      setReviews(
        reviews.map((review) => {
          if (review._id === updatedReview._id) {
            return updatedReview;
          }
          return review;
        })
      );
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
    loadReviews();
  };
  const handleUnbanUser = async (reviewId) => {
    try {
      const response = await axios.post(
        "api/reviews/unban-user",
        { reviewId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const updatedReview = response.data;
      setReviews(
        reviews.map((review) => {
          if (review._id === updatedReview._id) {
            return updatedReview;
          }
          return review;
        })
      );
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
    loadReviews();
  };
  const formatRating = (rating) => {
    const stars = "✯";
    return ` ${stars.repeat(rating)}`;
  };

  const nextPage = () =>
    setCurrentPage((prev) => {
      if (
        prev ===
        Math.ceil(
          (isAdmin ? filteredAdminReviews : filteredReviews).length /
            reviewsPerPage
        )
      ) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  const prevPage = () =>
    setCurrentPage((prev) => {
      if (prev === 1) {
        return prev;
      } else {
        return prev - 1;
      }
    });

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div>
      <h1 className="feedback">Отзывы покупателей</h1>
      {isLogged && !isAdmin ? (
        <Link to="/my-reviews" className="my-reviews">
          Посмотреть свои отзывы
        </Link>
      ) : null}
      <input
        type="text"
        placeholder="Поиск по названию книги"
        value={filterText}
        onChange={handleFilterChange}
        className="filter-text"
      />
      {isAdmin
        ? currentReviews.map((review) => (
            <div className="reviewContainer" key={review._id}>
              <div className="reviewedName">
                <i> Название книги: </i>
                {review.product.title}
              </div>
              <div className="reviewText">Отзыв: {review.text}</div>
              <div className="reviewRating">
                Рейтинг: <span>{formatRating(review.rating)}</span>
              </div>
              <div className="reviewDate">Автор: {review.author}</div>
              <div className="reviewDate">
                Дата создания: {formatDate(review.createdAt)}
              </div>
              <div className="admin-block">
                <button
                  className="my-reviews"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  Удалить
                </button>
                {!review.isUserBanned ? (
                  <button
                    className="my-reviews"
                    onClick={() => handleBanUser(review._id, review.user)}
                  >
                    Забанить
                  </button>
                ) : (
                  <button
                    className="my-reviews"
                    onClick={() => handleUnbanUser(review._id)}
                  >
                    Разбанить
                  </button>
                )}
              </div>
            </div>
          ))
        : currentReviews.map((review) => (
            <div className="reviewContainer" key={review._id}>
              <div className="reviewedName">
                <i> Название книги: </i>
                {review.product.title}
              </div>
              <div className="reviewText">Отзыв: {review.text}</div>
              <div className="reviewRating">
                Рейтинг: <span>{formatRating(review.rating)}</span>
              </div>
              <div className="reviewDate">Автор: {review.author}</div>
              <div className="reviewDate">
                Дата создания: {formatDate(review.createdAt)}
              </div>
            </div>
          ))}
      <Pagination
        reviewsPerPage={reviewsPerPage}
        totalReviews={(isAdmin ? filteredAdminReviews : filteredReviews).length}
        paginate={paginate}
        prevPage={prevPage}
        nextPage={nextPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Reviews;
