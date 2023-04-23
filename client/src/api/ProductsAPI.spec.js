import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import useProductsAPI from "./ProductsAPI";

jest.mock("axios");

describe("useProductsAPI", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("loads products on initial render", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
    ];

    axios.get.mockResolvedValueOnce({
      data: { products: mockProducts, result: mockProducts.length },
    });

    const { result, waitForNextUpdate } = renderHook(() => useProductsAPI());

    expect(result.current.products[0]).toEqual([]);
    expect(result.current.result[0]).toEqual(0);

    await waitForNextUpdate();

    expect(axios.get).toHaveBeenCalledWith(
      "/api/products?limit=9&&&title[regex]="
    );

    expect(result.current.products[0]).toEqual(mockProducts);
    expect(result.current.result[0]).toEqual(mockProducts.length);
  });
});
