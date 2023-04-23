import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [name] = state.userAPI.name;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  
  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/payment", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        } else {
          const res = await axios.get("/user/history", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        }
      };
      getHistory();
    }
  }, [token, isAdmin, setHistory]);

  return (
    <div className="history-page">
      <h2>История</h2>

      <h4>
        Ваши заказы, {name} равны: <span style={{color: "red", fontSize: "32px"}}>{history.length}</span>
      </h4>

      <table>
        <thead>
          <tr>
            <th>Платежный ID</th>
            <th>Дата покупки</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {history.map((items) => (
            <tr key={items._id}>
              <td>{items.paymentID}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/history/${items._id}`}>Смотреть</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
