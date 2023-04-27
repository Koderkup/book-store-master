import React, { useState, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../../GlobalState";

const ReviewForm = ({ productId, userId, author }) => {
  const state = useContext(GlobalState);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [token] = state.token;

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "/api/reviews",
        {
          author: author,
          rating: parseInt(rating),
          text: comment,
          product: productId,
          user: userId,
        },
        {
          headers: { Authorization: token },
        }
      );
      setRating("");
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__group">
        <label className="review-form__label" htmlFor="name">
          Имя:
        </label>
        <input
          className="review-form__input"
          type="text"
          id="name"
          defaultValue={author}
          required
        />
      </div>
      <div className="review-form__group">
        <label className="review-form__label" htmlFor="rating">
          Рейтинг:
        </label>
        <select
          className="review-form__select"
          id="rating"
          value={rating}
          onChange={handleRatingChange}
          required
        >
          <option value="" disabled hidden>
            Выберите рейтинг
          </option>
          <option value="1">1 звезда</option>
          <option value="2">2 звезды</option>
          <option value="3">3 звезды</option>
          <option value="4">4 звезды</option>
          <option value="5">5 звезд</option>
        </select>
      </div>
      <div className="review-form__group">
        <label className="review-form__label" htmlFor="comment">
          Комментарий:
        </label>
        <textarea
          className="review-form__textarea"
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          required
        ></textarea>
      </div>
      <button className="review-form__button" type="submit">
        Оставить отзыв
      </button>
    </form>
  );
};

export default ReviewForm;
