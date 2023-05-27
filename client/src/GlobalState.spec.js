import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import { DataProvider, GlobalState } from "./GlobalState";
import ProductsAPI from "./api/ProductsAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";

jest.mock("axios");
jest.mock("./api/ProductsAPI");
jest.mock("./api/UserAPI");
jest.mock("./api/CategoriesAPI");

describe("DataProvider component", () => {
  beforeEach(() => {
    axios.get.mockClear();
    ProductsAPI.mockClear();
    UserAPI.mockClear();
    CategoriesAPI.mockClear();
  });

  it("renders children components", () => {
    render(
          <DataProvider>
              <div>Child component</div>
          </DataProvider>
      );
    expect(screen.getByText("Child component")).toBeInTheDocument();
  });

  it("calls ProductsAPI on mount", () => {
    const mockToken = "mock_token";
    render(
      <GlobalState.Provider value={{ token: [mockToken] }}>
        <DataProvider>
          <div>Child component</div> 
      </DataProvider>
    </GlobalState.Provider>
    );
    expect(ProductsAPI).toHaveBeenCalledTimes(2);
  });

  it("calls UserAPI with token on mount", () => {
    const mockToken = "mock_token";
    render(
      <GlobalState.Provider value={{ token: [mockToken] }}>
        <DataProvider>
          <div>Child component</div> 
      </DataProvider>
    </GlobalState.Provider>
    );
    expect(UserAPI).toHaveBeenCalledTimes(1);
    
  });

 it("calls CategoriesAPI on mount", () => {
   const mockToken = "mock_token";
   render(
     <GlobalState.Provider value={{ token: [mockToken] }}>
       <DataProvider>
         <div>Child component</div>
       </DataProvider>
     </GlobalState.Provider>
   );
    expect(CategoriesAPI).toHaveBeenCalledTimes(1);
  }); 

   it("calls refreshToken API on mount if firstLogin exists in localStorage", () => {
    const mockRefreshToken = "mock_refresh_token";
    localStorage.setItem("firstLogin", "true");
    axios.get.mockResolvedValueOnce({
      data: { accesstoken: mockRefreshToken },
    });
    render(
      <GlobalState.Provider >
        <DataProvider>
          <div>Child component</div>
        </DataProvider>
      </GlobalState.Provider>
    );
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("/user/refresh_token");
    jest.advanceTimersByTime(10 * 60 * 1000);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("/user/refresh_token");
  }); 

  it("doesn't call refreshToken API on mount if firstLogin doesn't exist in localStorage", () => {
    localStorage.removeItem("firstLogin");
    const mockToken = "mock_token";
    render(
      <GlobalState.Provider value={{ token: [mockToken] }}>
        <DataProvider>
          <div>Child component</div>
        </DataProvider>
      </GlobalState.Provider>
    );
    expect(axios.get).not.toHaveBeenCalled();
  }); 
});

