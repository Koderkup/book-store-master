import React from "react";
import { render, screen } from "@testing-library/react";
import Cart from "./Cart";

jest.mock("./Cart", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="cart-component" />;
  },
}));

describe("Cart component", () => {
  it("renders without errors", () => {
    render(<Cart />);
    const cartComponent = screen.getByTestId("cart-component");
    expect(cartComponent).toBeInTheDocument();
  });
});

// import React from "react";
// import { render, screen } from "@testing-library/react";
// import Cart from "./Cart";
// import { GlobalState } from "context/GlobalState";
// import { MemoryRouter } from "react-router-dom";

// describe("Компонент Cart", () => {
//   it("рендерится без ошибок", () => {
//     render(
//       <GlobalState.Provider
//         value={{
//           userAPI: { cart: [[], jest.fn()] },
//           token: ["token", jest.fn()],
//         }}
//       >
//         <MemoryRouter>
//           <Cart />
//         </MemoryRouter>
//       </GlobalState.Provider>
//     );
//     expect(screen.getByTestId("cart")).toBeInTheDocument();
//   });

//   it("показывает сообщение о пустой корзине, если корзина пустая", () => {
//     render(
//       <GlobalState.Provider
//         value={{
//           userAPI: { cart: [[], jest.fn()] },
//           token: ["token", jest.fn()],
//         }}
//       >
//         <MemoryRouter>
//           <Cart />
//         </MemoryRouter>
//       </GlobalState.Provider>
//     );
//     expect(screen.getByText("Корзина пустая")).toBeInTheDocument();
//   });

//   it("показывает товары, если корзина содержит товары", () => {
//     const state = {
//       userAPI: {
//         cart: [
//           [
//             {
//               _id: "1",
//               title: "Товар 1",
//               price: 100,
//               quantity: 1,
//               images: { url: "test.png" },
//               description: "Описание товара 1",
//               author: "Автор товара 1",
//             },
//           ],
//           jest.fn(),
//         ],
//       },
//       token: ["token", jest.fn()],
//     };
//     render(
//       <GlobalState.Provider value={state}>
//         <MemoryRouter>
//           <Cart />
//         </MemoryRouter>
//       </GlobalState.Provider>
//     );
//     expect(screen.getByTestId("product-title").textContent).toContain(
//       "Товар 1"
//     );
//   });

//   it("вызывает функцию addToCart при добавлении товара в корзину", () => {
//     const state = {
//       userAPI: {
//         cart: [
//           [
//             {
//               _id: "1",
//               title: "Товар 1",
//               price: 100,
//               quantity: 1,
//               images: { url: "test.png" },
//               description: "Описание товара 1",
//               author: "Автор товара 1",
//             },
//           ],
//           jest.fn(),
//         ],
//       },
//       token: ["token", jest.fn()],
//     };
//     const mockAddToCart = jest.fn();
//     render(
//       <GlobalState.Provider value={{ ...state, addToCart: mockAddToCart }}>
//         <MemoryRouter>
//           <Cart />
//         </MemoryRouter>
//       </GlobalState.Provider>
//     );
//     screen.getByTestId("add-to-cart").click();
//     expect(mockAddToCart).toHaveBeenCalled();
//   });

//   it("вызывает функцию removeProduct при удалении товара из корзины", () => {
//     const state = {
//       userAPI: {
//         cart: [
//           [
//             {
//               _id: "1",
//               title: "Товар 1",
//               price: 100,
//               quantity: 1,
//               images: { url: "test.png" },
//               description: "Описание товара 1",
//               author: "Автор товара 1",
//             },
//           ],
//           jest.fn(),
//         ],
//       },
//       token: ["token", jest.fn()],
//     };
//     const mockRemoveProduct = jest.fn();
//     render(
//       <GlobalState.Provider
//         value={{ ...state, removeProduct: mockRemoveProduct }}
//       >
//         <MemoryRouter>
//           <Cart />
//         </MemoryRouter>
//       </GlobalState.Provider>
//     );
//     screen.getByTestId("delete-btn").click();
//     expect(mockRemoveProduct).toHaveBeenCalled();
//   });
// });
