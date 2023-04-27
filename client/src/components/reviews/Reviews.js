import React, { useState, useEffect } from "react";

import axios from "axios";
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filterText, setFilterText] = useState("");
  
  const filteredReviews = reviews.filter((review) => {
  const bookTitle = review.product.title.toLowerCase();
    return bookTitle.includes(filterText.toLowerCase());
  });

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };
  const loadReviews = async () => {
    try {
      const response = await axios.get("api/reviews");
      const data = response.data;
      console.log(data);
      setReviews(data);
    } catch (err) {
      console.error(err);
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

  const formatRating = (rating) => {
    const stars = "✯";
    return ` ${stars.repeat(rating)}`;
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div>
      <h1>Отзывы покупателей</h1>
      <input
        type="text"
        placeholder="Поиск по названию книги"
        value={filterText}
        onChange={handleFilterChange}
        className="filter-text"
      />
      {filteredReviews.map((review) => (
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
    </div>
  );
};

export default Reviews;
