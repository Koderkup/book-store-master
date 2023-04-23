import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import { nanoid } from "nanoid";
import QRCode from "react-qr-code";

function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  const [address] = state.userAPI.email;
  const [qr, setQr] = useState(false);
  const [status, setStatus] = useState("Отправить");
  const [email, setEmail] = useState("");
  const [payNumber, setPayNumber] = useState("");
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("");


  const formHandler = async (e) => {
    e.preventDefault();
    setStatus("Отпраляется!.......");
     const { pay_number, email, message } = e.target.elements;
    let details = {
      pay_number: pay_number.value,
      email: email.value,
      message: message.value,
    };
       tranSuccess();
   let response = await fetch("http://localhost:5000/email", {
     method: "POST",
     headers: {
       "Content-Type": "application/json;charset=utf-8",
     },
     body: JSON.stringify({ ...details }),
   });
    setStatus("Отправить");
   console.log(response.status);
   
  };
  const getQrCode = async (total) => {
    try {
      const response = await axios.get(`/api/payment/qrcode/${total}/`, {
        headers: { Authorization: token },
      });
      console.log(response.data.msg);
      setValue(response.data.msg);
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.msg);
      } else {
        alert("Что-то пошло не так. Попробуйте позже");
      }
    }
  };

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };

    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Вы хотите удалить этот продукт?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };

  const tranSuccess = async () => {
    const paymentID = nanoid();
    try {
      await axios.post(
        "/api/payment",
        { cart, paymentID, address },
        {
          headers: { Authorization: token },
        }
      );
    } catch (error) {
      console.error(error.response.data);
    }

    setCart([]);
    addToCart([]);
    if (cart.length !== 0) {
      alert("Заказ был успешно оформлен.");
    }
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Корзина пустая</h2>
    );

  return (
    <div>
      {cart.map((product) => (
        <div className="detail cart" key={product._id}>
          <img src={product.images.url} alt="" />

          <div className="box-detail">
            <h2>{product.title}</h2>

            <h3>руб {product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.author}</p>

            <div className="amount">
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>

            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}

      <div className="total">
        <h3>Всего: руб {total}</h3>
      </div>
      <div className="button_wraper">
        <button className="pay_btn" onClick={() => tranSuccess()}>
          Получить товар в пункте выдачи.
        </button>
        <button
          className="pay_btn"
          onClick={(e) => {
            e.preventDefault();
            setQr(!qr);
            getQrCode(total);
          }}
        >
          {!qr ? "Оплатить по QR Code" : "Передумал"}
        </button>
      </div>
      {qr && cart.length > 0 ? (
        <div className="modal_overlay">
          <QRCode value={value} className="qrcode" />
          <form className="modal" onSubmit={formHandler}>
            <input
              className="pay_number"
              type="text"
              placeholder="введите номер платежа"
              name="pay_number"
              onChange={(e) => {
                setPayNumber(e.target.value);
              }}
              required
            />
            <input
              className="pay_number"
              type="email"
              name="email"
              placeholder="email для обратной связи"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <textarea
              placeholder="напишите адрес и предпочтительное время доставки"
              name="message"
              className="address"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              required
            />
            <button type="submit" className="pay_btn">
              {status}
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Cart;
