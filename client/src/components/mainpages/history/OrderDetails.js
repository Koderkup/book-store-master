import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

function OrderDetails() {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [orderDetails, setOrderDetails] = useState([]);

  const params = useParams();

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
            <td>
              {orderDetails.address}
            </td>
            <td>{orderDetails.address.postal_code ? orderDetails.address.postal_code : '210040'}</td>
            <td>{orderDetails.address.country_code ? orderDetails.address.country_code: '+375'}</td>
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
          {orderDetails.cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt="" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>руб {item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
