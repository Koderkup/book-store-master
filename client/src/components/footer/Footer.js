import React from "react";
import "./footer.css";
import { ReactComponent as Viber } from "../../components/headers/icon/Viber.svg";
import { ReactComponent as Instagram } from "../../components/headers/icon/Instagram.svg";
import {ReactComponent as Telegram } from "../../components/headers/icon/Telegram.svg";
const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <h3>О нас</h3>
          <p>Мы являемся поставщиками интересных книг по всему городу.</p>
          <div className="social_media_wraper">
            <a title="Viber" href="viber://chat?number=375257729344">
              <Viber className="social_media" />
            </a>
            <a
              title="Telegram"
              href="https://telegram.me/koderkup"
              target={"_blank"}
              rel="noreferrer"
            >
              <Telegram className="social_media" />
            </a>
            <a href="https://instagram.com/koderkup/" title="Instagram">
              <Instagram className="social_media" />
            </a>
          </div>
        </div>
        <div className="row">
          <h3>Контакты</h3>
          <p>Наш адрес: ул. В.Интернационалистов, д. 7, г. Витебск</p>
          <p>Телефон: +375 (25) 772-93-44</p>
          <p>Email: itlearn.ku@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
