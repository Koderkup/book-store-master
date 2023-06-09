import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const addCart = state.userAPI.addCart;
  const [detailProduct, setDetailProduct] = useState([]);

  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) setDetailProduct(product);
      });
    }
  }, [params.id, products]);

  if (detailProduct.length === 0) return <div>...Loading</div>;

  return (
    <>
      <div className="detail" data-testid="detail">
        <img src={detailProduct.images.url} alt="" />
        <div className="box-detail">
          <div className="row">
            <h2>{detailProduct.title}</h2>
            <h6>#id: {detailProduct.product_id}</h6>
          </div>
          <span>{detailProduct.price} руб</span>
          <p>{detailProduct.description}</p>
          <p>{detailProduct.author}</p>
          <p>Продано: {detailProduct.sold}</p>
          {detailProduct.quantity > 0 ? (
            <Link
              to="/cart"
              className="cart"
              onClick={() => addCart(detailProduct)}
            >
              Купить сейчас
            </Link>
          ) : null}
        </div>
      </div>
      <div>
        <h2>Похожие товары</h2>
        <div className="products">
          {products.map((product) => {
            return product.category === detailProduct.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
