import React from "react";
import BtnRender from "./BtnRender";

function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {
  return (
    <div className="product_card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <img src={product.images.url} alt="" />

      <div className="product_box">
        <h2 title={product.title}>{product.title}</h2>
        <span className="price">{product.price} руб </span>
        {product.quantity > 0 ?  <span>кол-во {product.quantity} шт</span> : <span>нет в наличии</span>}       
        <p>
          <span>{product.author}</span>
          <br />
          {product.description}
        </p>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
}

export default ProductItem;
