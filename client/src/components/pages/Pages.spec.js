import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import Pages from "./Pages";
import Products from "./products/Products";
import DetailProduct from "./detailProduct/DetailProduct";
import Login from "./auth/Login";
import Register from "./auth/Register";
import OrderHistory from "./history/OrderHistory";
import OrderDetails from "./history/OrderDetails";
import Cart from "./cart/Cart";
import NotFound from "./utils/not_found/NotFound";
import Categories from "./categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";
import Reviews from "../reviews/Reviews";
import MyReviews from "../reviews/MyReviews";
import QRCode from "react-qr-code";
import Map from "./cart/Map";
import { nanoid } from "nanoid";
import { MapContainer } from "react-leaflet";

jest.mock("react-leaflet", () => {
  return {
    MapContainer: jest.fn((props) => <div {...props} data-testid="map" />),
  };
});



jest.mock("./cart/Map", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="map-div" />;
  },
}));

jest.mock("nanoid", () => {
  return {
    nanoid: jest.fn(() => "mocked-id"),
  };
});


jest.mock("react-qr-code", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="qr-code" />;
  },
}));


jest.mock("./cart/Cart", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="cart-page" />;
  },
}));

jest.mock("./products/Products", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="products-page" />;
  },
}));

jest.mock("./detailProduct/DetailProduct", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="detailProducts-page" />;
  },
}));

jest.mock("./utils/not_found/NotFound", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="notFound-page" />;
  },
}));

jest.mock("./auth/Register", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="register-page" />;
  },
}));

jest.mock("./categories/Categories", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="category-page" />;
  },
}));

jest.mock("./createProduct/CreateProduct", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="createProduct-page" />;
  },
}));

jest.mock("../reviews/Reviews", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="reviews-page" />;
  },
}));

jest.mock("../reviews/MyReviews", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="MyReviews-page" />;
  },
}));

describe("Pages", () => {
const state = {
  userAPI: {
    isLogged: [false],
    isAdmin: [false],
  },
  productsAPI: {
    products: [],
    callback: () => {},
    token: "test-token",
  },
};

  it("renders Products as the default route", () => {

    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/"]}>
          <Pages/>
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId("products-page")).toBeInTheDocument();
  });

  it("does not display a warning message", () => {
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(console.error).not.toHaveBeenCalled();

    console.error = originalError;
  });
  it("renders DetailProduct when the route matches /detail/:id", () => {
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/detail/123"]}>
          <Routes>
            <Route path="/detail/:id" element={<DetailProduct />} />
          </Routes>
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId("detailProducts-page")).toBeInTheDocument();
  });

  it("renders Login when the route matches /login and the user is not logged in", () => {
    state.userAPI.isLogged[0] = false;
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/login"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getAllByText(/Login/i)[0]).toBeInTheDocument();
  });

  it("renders NotFound when the route matches /login and the user is logged in", () => {
     state.userAPI.isLogged[0] = true;

    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/login"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId("notFound-page")).toBeInTheDocument();
  });

  it("renders Register when the route matches /register and the user is not logged in", () => {
    state.userAPI.isLogged[0] = false;
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/register"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  it("renders NotFound when the route matches /register and the user is logged in", async () => {
    state.userAPI.isLogged[0] = true;
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/register"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );
    expect(screen.getByTestId('notFound-page')).toBeInTheDocument();
  });

  it("renders Categories when the route matches /category and the user is an admin", () => {
state.userAPI.isLogged[0] = true;
state.userAPI.isAdmin[0] = true;
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/category"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId('category-page')).toBeInTheDocument();
  });

  it("renders NotFound when the route matches /category and the user is not an admin", () => {
    state.userAPI.isAdmin[0] = false;
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/category"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId('notFound-page')).toBeInTheDocument();
  });

  it("renders CreateProduct when the route matches /create_product and the user is an admin", () => {
state.userAPI.isLogged[0] = true;
state.userAPI.isAdmin[0] = true;

    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/create_product"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId('createProduct-page')).toBeInTheDocument();
  });

  it("renders NotFound when the route matches /create_product and the user is not an admin", () => {
    state.userAPI.isLogged[0] = false;
    state.userAPI.isAdmin[0] = false;
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/create_product"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );
    expect(screen.getByTestId('notFound-page')).toBeInTheDocument();
  });

  it("renders Cart when the route matches /cart", () => {
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/cart"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
  });

  it("renders Reviews when the route matches /reviews", () => {
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/reviews"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId('reviews-page')).toBeInTheDocument();
  });

  it("renders MyReviews when the route matches /my-reviews", () => {
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/my-reviews"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId('MyReviews-page')).toBeInTheDocument();
  });

  it("renders NotFound when the route does not match any of the defined routes", () => {
    render(
      <GlobalState.Provider value={state}>
        <MemoryRouter initialEntries={["/unknown-route"]}>
          <Pages />
        </MemoryRouter>
      </GlobalState.Provider>
    );

    expect(screen.getByTestId('notFound-page')).toBeInTheDocument();
  });
});
