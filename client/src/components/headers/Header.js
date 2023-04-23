 import React, {useContext, useState} from 'react'
 import { GlobalState } from '../../GlobalState'
 import { Link } from "react-router-dom";
 import Menu from "./icon/menu.svg";
 import Close from "./icon/close.svg";
 import Cart from "./icon/cart.svg";
 import axios from "axios";

 const Header = () => {
  const state = useContext(GlobalState);
 const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] =  state.userAPI.isAdmin;
  const [cart] =  state.userAPI.cart;
  const [menu, setMenu] = useState(false);
  const [name] = state.userAPI.name;
  
 const logoutUser = async () => {
   await axios.get("/user/logout");

   localStorage.removeItem("firstLogin");

   window.location.href = "/";
 };

 const adminRouter = () => {
   return (
     <>
       <li>
         <Link to="/create_product">Создать товар</Link>
       </li>
       <li>
         <Link to="/category">Категории</Link>
       </li>
     </>
   );
 };

 const loggedRouter = () => {
   return (
     <>
       <li>
         <Link to="/history">История</Link>
       </li>
       <li>
         <Link to="/" onClick={logoutUser}>
        {name}   Logout
         </Link>
       </li>
     </>
   );
 };

  const styleMenu = {
    left: menu ? 0 : "-100%",
  };

  return (
    <header>
      <div className="menu" onClick={() => setMenu(!menu)}>
        <img src={Menu} alt="menu" width="30" />
      </div>

      <div className="logo">
        <h1>
          <Link to="/">{isAdmin ? "Admin" : "Магазин книг"}</Link>
        </h1>
      </div>

      <ul style={styleMenu} data-testid="mobile-header">
        <li>
          <Link to="/">{isAdmin ? "Товары" : "Магазин"}</Link>
        </li>

        {isAdmin && adminRouter()}

        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link to="/login">Login ✥ Register</Link>
          </li>
        )}

        <li onClick={() => setMenu(!menu)}>
          <img src={Close} alt="close" width="30" className="menu" />
        </li>
      </ul>

      {isAdmin ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
    </header>
  );
 }

 export default Header