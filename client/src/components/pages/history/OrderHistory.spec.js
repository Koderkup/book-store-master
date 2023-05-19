import React from "react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { render, screen } from "@testing-library/react";
import OrderHistory from "./OrderHistory";
import { GlobalState } from "../../../GlobalState";

jest.mock("axios");

describe("OrderHistory", () => {
  const history = [
    {
      _id: "1",
      paymentID: "payment1",
      createdAt: "2022-05-18T12:00:00.000Z",
      status: true,
    },
    {
      _id: "2",
      paymentID: "payment2",
      createdAt: "2022-05-19T12:00:00.000Z",
      status: false,
    },
  ];
  const state = {
    userAPI: {
      history: [[...history], jest.fn()],
      name: ["test user"],
      isAdmin: [false],
      setHistory: jest.fn(),
      setName: jest.fn(),
      setIsAdmin: jest.fn(),
    },
    token: [null],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders OrderHistory component", () => {
    const wrapper = ({ children }) => (
      <BrowserRouter>
        <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
      </BrowserRouter>
    );
    render(<OrderHistory />, { wrapper });
    expect(screen.getByTestId("history-page")).toBeInTheDocument();
    expect(screen.getByText("История")).toBeInTheDocument();
  });

  it("displays order history for user", async () => {
    state.token[0] = "test-token";
    axios.get.mockResolvedValueOnce({ data: { history } });
    const wrapper = ({ children }) => (
      <BrowserRouter>
        <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
      </BrowserRouter>
    );
    render(<OrderHistory />, { wrapper });

    expect(axios.get).toHaveBeenCalledWith(
      "/user/history",
      expect.objectContaining({ headers: { Authorization: "test-token" } })
    );
    expect(screen.getByText("payment1")).toBeInTheDocument();
    expect(screen.getByText("18.05.2022")).toBeInTheDocument();
  });

 it("displays order history for admin", async () => {
   state.userAPI.isAdmin[0] = true;
   state.token[0] = "test-token";
   const mockData = {
     data: { history: history },
   };
   axios.get.mockResolvedValueOnce(mockData);
   const wrapper = ({ children }) => (
     <BrowserRouter>
       <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
     </BrowserRouter>
   );
   render(<OrderHistory />, { wrapper });
   expect(axios.get).toHaveBeenCalledWith(
     "/api/payment",
     expect.objectContaining({ headers: { Authorization: "test-token" } })
   );
   await screen.findAllByText("Смотреть");
   expect(screen.getByText("payment2")).toBeInTheDocument();
   expect(screen.getByText("19.05.2022")).toBeInTheDocument();
 });
});
