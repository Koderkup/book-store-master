import React, { useContext, useEffect, useState, useCallback} from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [name] = state.userAPI.name;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [orderNumber, setOrderNumber] = useState();
  
  const getHistory = useCallback(async () => {
    let url = "";
    if (isAdmin) {
      url = "/api/payment";
    } else {
      url = "/user/history";
    }
    const params = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // добавляем один день к дате окончания поиска
      end.setDate(end.getDate() + 1);
      params.startDate = start.toISOString();
      params.endDate = end.toISOString();
    }
    if (userName) {
      params.userName = userName;
    }
    const res = await axios.get(url, {
      headers: { Authorization: token },
      params,
    });
    if (Array.isArray(res.data)) {
      setHistory(
        res.data.filter((items) => filterHistoryItems(items, isAdmin))
      );
      setOrderNumber(history.length);
    } else {
      console.log("Неправильный формат данных");
    }
  }, [isAdmin, startDate, endDate, userName, token, setHistory]);
  
  useEffect(() => {
    if (token) {
      getHistory();
    }
  }, [token, getHistory]);

  useEffect(() => {
    setOrderNumber(history.length);
  }, [history]);
  const handleDelete = async () => {
    const selectedIds = selectedPayments.map((payment) => payment._id);
    const res = await axios.delete("/api/payment", {
      headers: { Authorization: token, "Content-Type": "application/json" },
      data: { ids: selectedIds },
    });
    alert(res.data.message);
    setSelectedPayments([]);
    getHistory();
  };

  const handleStatus = async (e, items) => {
    const newStatus = e.target.checked;
    const paymentId = items._id;
    const res = await axios.post(
      "/api/payment/update-status",
      { paymentId, status: newStatus },
      { headers: { Authorization: token } }
    );
      getHistory();
  };

  const filterHistoryItems = (items, isAdmin) => {
    if (isAdmin) {
      return true; // показываем все элементы
    } else {
      return items.status; // показываем элементы только у которых status=true
    }
  };

  return (
    <div className="history-page" data-testid="history-page">
      <h2>История</h2>
      {isAdmin && (
        <div className="adminSearch">
          <div className="adminSearchElement">
            <label htmlFor="startDateInput">Начальная дата:</label>
            <input
              id="startDateInput"
              name="startDateInput"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="adminSearchElement">
            <label htmlFor="endDateInput">Конечная дата:</label>
            <input
              id="endDateInput"
              name="endDateInput"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="adminSearchElement">
            <label htmlFor="userNameInput">Имя пользователя:</label>
            <input
              id="userNameInput"
              name="userNameInput"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <button className="adminBlockBtn" onClick={getHistory}>
            Поиск
          </button>
          <button className="adminBlockBtn" onClick={handleDelete}>
            Удалить выбранное
          </button>
        </div>
      )}
      <h4>
        {isAdmin
          ? `Количество покупок на вашем сайте, ${name} равно: `
          : `Ваши заказы, ${name} в количестве: `}
        <span style={{ color: "red", fontSize: "32px" }}>{orderNumber}</span>
      </h4>

      <table>
        <thead>
          <tr>
            <th>Платежный ID</th>
            <th>Дата покупки</th>
            <th>Детали платежа</th>
            {isAdmin && <th>Статус/Удаление</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(history) &&
            history.map((items) => (
              <tr key={items._id}>
                <td>{items.paymentID}</td>
                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/history/${items._id}`}>Смотреть</Link>
                </td>
                {isAdmin && (
                  <td className="adminTd">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        handleStatus(e, items);
                      }}
                      checked={items.status}
                    ></input>
                    <span> Status </span>
                    <input
                      type="checkbox"
                      checked={selectedPayments.some(
                        (p) => p._id === items._id
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPayments([...selectedPayments, items]);
                        } else {
                          setSelectedPayments(
                            selectedPayments.filter((p) => p._id !== items._id)
                          );
                        }
                      }}
                    />
                    <span>Удаляем</span>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
