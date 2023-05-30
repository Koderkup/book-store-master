import UserAPI from "./UserAPI";
import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { act } from "react-test-renderer";

jest.mock("axios");
describe("UserAPI Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });  

  it("sets isLogged to true if user is logged in", async () => {
    axios.get.mockResolvedValueOnce({
      data: { name: "Test User", role: 0, cart: [], email: "test@example.com" },
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      UserAPI("test-token")
    );
    await waitForNextUpdate();
    expect(result.current.isLogged[0]).toBe(true);
  });

  it("sets isAdmin to true if user is admin", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        name: "Admin User",
        role: 1,
        cart: [],
        email: "admin@example.com",
      },
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      UserAPI("test-token")
    );
    await waitForNextUpdate();
    expect(result.current.isAdmin[0]).toBe(true);
  });

  it("sets isAdmin to false if user is not admin", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        name: "Regular User",
        role: 0,
        cart: [],
        email: "user@example.com",
      },
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      UserAPI("test-token")
    );
    await waitForNextUpdate();
    expect(result.current.isAdmin[0]).toBe(false);
  });

  it("adds product to cart if it is not already in cart", async () => {
    axios.get.mockResolvedValueOnce({
      data: { name: "Test User", role: 0, cart: [], email: "test@example.com" },
    });
    axios.patch.mockResolvedValueOnce({});
    const { result, waitForNextUpdate } = renderHook(() =>
      UserAPI("test-token")
    );
    await waitForNextUpdate();
    act(() => {
      result.current.addCart({
        _id: "test-product-id",
        name: "Test Product",
        quantity: 1,
      });
    });
    expect(result.current.cart[0]).toEqual([
      { _id: "test-product-id", name: "Test Product", quantity: 1 },
    ]);
  });

  it('displays "Product already in cart" message if product is already in cart', async () => {
    const existingProduct = {
      _id: "test-product-id",
      name: "Test Product",
      quantity: 1,
    };
    axios.get.mockResolvedValueOnce({
      data: {
        name: "Test User",
        role: 0,
        cart: [existingProduct],
        email: "test@example.com",
      },
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      UserAPI("test-token")
    );
    await waitForNextUpdate();
    global.alert = jest.fn();
    act(() => {
      result.current.addCart(existingProduct);
    });
    expect(global.alert).toHaveBeenCalledWith(
      "Этот продукт уже добавлен в корзину."
    );
  });

  it('displays "Please register to make purchases" message if user is not logged in', async () => {
    const { result } = renderHook(() => UserAPI(null));
    global.alert = jest.fn();
    act(() => {
      result.current.addCart({
        _id: "test-product-id",
        name: "Test Product",
        quantity: 1,
      });
    });
    expect(global.alert).toHaveBeenCalledWith(
      "Пожалуйста зарегистрируйтесь для совершения покупок."
    );
  });
});
