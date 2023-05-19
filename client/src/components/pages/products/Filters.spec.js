import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlobalState } from "../../../GlobalState";
import Filters from "./Filters";


describe("Filters", () => {
   const setSort = jest.fn();
  const state = {
    categoriesAPI: {
      categories: ["category=Test", jest.fn()],
    },
    productsAPI: {
      category: ["test"],
      sort: "",
      search: ["", jest.fn()],
      setSort: setSort,
    },
  };
  it("should render filter menu", () => {
    render(
      <GlobalState.Provider value={state}>
        <Filters />
      </GlobalState.Provider>
    );
    expect(screen.getByText("Фильтр:")).toBeInTheDocument();
  });
  it("should display all products by default", () => {
     render(
       <GlobalState.Provider value={state}>
         <Filters />
       </GlobalState.Provider>
     );
    expect(screen.getByTestId("category-select")).toHaveValue("");
  });
  
  it("should call setSearch when search input is changed", () => {
    const setSearch = jest.spyOn(state.productsAPI.search, 1);
    setSearch.mockImplementation(() => {});
    render(
      <GlobalState.Provider value={state}>
        <Filters />
      </GlobalState.Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Введите что искать!"), {
      target: { value: "test" },
    });
    expect(setSearch).toHaveBeenCalledWith("test");
    setSearch.mockRestore();
  });

  it("should display sort options in select", () => {
     render(
       <GlobalState.Provider value={state}>
         <Filters />
       </GlobalState.Provider>
     );
    expect(screen.getByText("Последние")).toBeInTheDocument();
    expect(screen.getByText("Не новые")).toBeInTheDocument();
    expect(screen.getByText("Лучшие продажи")).toBeInTheDocument();
    expect(screen.getByText("Цена: По-убыванию")).toBeInTheDocument();
    expect(screen.getByText("Цена: По-возрастанию")).toBeInTheDocument();
  });
});