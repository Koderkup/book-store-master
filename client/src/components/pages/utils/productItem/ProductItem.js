import React, { useState } from "react";
import BtnRender from "./BtnRender";
import NotFoundImage from "./asset/not_found.png";
function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => {
    setImageError(true);
  };
  return (
    <div className="product_card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      {!imageError ? (
        <img
          src={product.images.url}
          alt="изображение временно недоступно"
          className="img"
          style={{ fontSize: "40px", textAlign: "center", color: "red" }}
          onError={handleImageError}
        />
      ) : (
        <img
          src={NotFoundImage}
          alt="изображение не найдено"
          style={{ fontSize: "40px", textAlign: "center", color: "red" }}
        />
      )}

      <div className="product_box">
        <h2 title={product.title}>{product.title}</h2>
        <span className="price">{product.price} руб </span>
        {product.quantity > 0 ? (
          <span>кол-во {product.quantity} шт</span>
        ) : (
          <span>нет в наличии</span>
        )}
        <p>
          <span>{product.author}</span>
          <br />
          {product.genre}
          <br />
          {product.description}
        </p>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
}

export default ProductItem;
