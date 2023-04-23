import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { GlobalState } from "../../../GlobalState";

const renderWithProviders = (component, mockValue) => {
  return render(
    <BrowserRouter>
      <GlobalState.Provider value={mockValue}>{component}</GlobalState.Provider>
    </BrowserRouter>
  );
};

export default renderWithProviders;
