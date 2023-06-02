import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LoadMore from "./LoadMore";
import { GlobalState } from "../../../GlobalState";

describe("LoadMore component", () => {
  
  const setPage = jest.fn();
  
  const result = 10;
 
  const page = 1;
  
  const state = {
    productsAPI: {
      page: [page, setPage],
      result: [result],
    },
  };

  it("should render LoadMore button", () => {
    render(<GlobalState.Provider value={state}><LoadMore /></GlobalState.Provider>)
    expect(screen.getByRole("button")).not.toBeNull();
  });

  it("should call setPage on button click", () => {
    render(
      <GlobalState.Provider value={state}>
        <LoadMore />
      </GlobalState.Provider>
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setPage).toHaveBeenCalledWith(page + 1);
  }); 
 

  it("should not render LoadMore button if result is less than page * 9", () => {
    const stateWithResultLessThanPage = {
      productsAPI: {
        page: [page, setPage],
        result: [result / 9],
      },
    };
     render(
       <GlobalState.Provider value={stateWithResultLessThanPage}>
         <LoadMore />
       </GlobalState.Provider>
     );
    expect(screen.queryByRole("button")).toBeNull();
    });
    
  });


