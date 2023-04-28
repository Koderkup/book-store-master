import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../GlobalState";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const state = useContext(GlobalState);
  const [token] = state.token;

  const handleReviewTextChange = (e, id) => {
    const newReviews = reviews.map((review) => {
      if (review._id === id) {
        return {
          ...review,
          text: e.target.value,
        };
      }
      return review;
    });
    setReviews(newReviews);
  };

  const handleReviewRatingChange = (e, id) => {
    const newReviews = reviews.map((review) => {
      if (review._id === id) {
        return {
          ...review,
          rating: e.target.value,
        };
      }
      return review;
    });
    setReviews(newReviews);
  };

  useEffect(() => {
    const getMyReviews = async () => {
      try {
        const res = await axios.get("/api/my-reviews", {
          headers: { Authorization: token },
        });
        const reviewsData = res.data;
        console.log(reviewsData);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
      }
    };

    getMyReviews();
  }, []);

  const handleEdit = async (e, id, data, token) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/my-reviews/${id}`, data, {
        headers: {
          Authorization: token,
        },
      });

      setReviews(
        reviews.map((review) =>
          review._id === res.data._id ? res.data : review
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
  };
  return (
    <div className="myReviewsToEdit">
      {reviews.map((review) => (
        <form
          key={review._id}
          onSubmit={(e) =>
            handleEdit(
              e,
              review._id,
              { text: review.text, rating: review.rating },
              token
            )
          }
          className="reviewEditForm"
        >
          <p>
            Название книги: <i>{review.product.title}</i>
          </p>
          <textarea
            className="reviewEditTextarea"
            value={review.text}
            onChange={(e) => {
              handleReviewTextChange(e, review._id);
            }}
          ></textarea>
          <span>Рейтинг: </span>
          <input
            type="text"
            value={review.rating}
            onChange={(e) => {
              handleReviewRatingChange(e, review._id);
            }}
          />
          <button type="submit" className="editReviewBtn">
            Редактировать
          </button>
        </form>
      ))}
    </div>
  );
};

export default MyReviews;
