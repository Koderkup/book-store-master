import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ReviewForm from "../../reviews/ReviewForm";

function OrderDetails() {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [orderDetails, setOrderDetails] = useState([]);
  const [isLogged] = state.userAPI.isLogged;
  const [productId, setProductId] = useState("");
  const [selectedValue, setSelectedValue] = useState('');
  const params = useParams();

  function handleCheckboxChange(e) {
    if(!selectedValue){
 setSelectedValue(e.target.value);
    } else {
      setSelectedValue('');
    }
   
  }
  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) setOrderDetails(item);
      });
    }
  }, [params.id, history]);

  if (orderDetails.length === 0) return null;

  return (
    <div className="history-page">
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Адрес</th>
            <th>Почтовый код</th>
            <th>Код страны</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{orderDetails.name}</td>
            <td>{orderDetails.address}</td>
            <td>
              {orderDetails.address.postal_code
                ? orderDetails.address.postal_code
                : "210040"}
            </td>
            <td>
              {orderDetails.address.country_code
                ? orderDetails.address.country_code
                : "+375"}
            </td>
          </tr>
        </tbody>
      </table>

      <table style={{ margin: "30px 0px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Товары</th>
            <th>Кол-во</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.cart.map((item, index) => (
            <tr key={item._id}>
              <td className="td">
                <input
                  type="checkbox"
                  className="checkdox"
                  value={`option${index}`}
                  checked={selectedValue === `option${index}`}
                  onChange={(e) => {
                    setProductId(item._id);
                    handleCheckboxChange(e);
                  }}
                />
                <img src={item.images.url} alt="" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>руб {(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(isLogged && productId && selectedValue) ? (
        <ReviewForm
          productId={productId}
          userId={orderDetails.user_id}
          author={orderDetails.name}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default OrderDetails;
