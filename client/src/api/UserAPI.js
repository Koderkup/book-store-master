import { useState, useEffect } from "react";
import axios from "axios";

function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [email, setEmail] = useState('')
  const [name, setName] = useState();

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("/user/infor", {
            headers: { Authorization: token },
          });
          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
          setName(res.data.name);
          setCart(res.data.cart);
          setEmail(res.data.email);
        } catch (err) {
          if (err.response && err.response.data) {
            alert(err.response.data.msg);
          } else {
            alert("Что-то пошло не так. Попробуйте позже");
          }
        }
      };

      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged)
      return alert("Пожалуйста зарегистрируйтесь для совершения покупок.");

    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        "/user/addcart",
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      alert("Этот продукт уже добавлен в корзину.");
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
    name: [name, setName],
    email: [email, setEmail],
  };
}

export default UserAPI;
