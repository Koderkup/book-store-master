import React from "react";
import { DataProvider } from "./GlobalState";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/headers/Header";
import MainPages from "./components/mainpages/Pages";
import Footer from "./components/footer/Footer";

const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <MainPages />
          <Footer/>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
