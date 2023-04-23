import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import CategoriesAPI from "./CategoriesAPI";

jest.mock("axios");

describe("CategoriesAPI", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches categories on initial render", async () => {
    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];

    axios.get.mockResolvedValueOnce({ data: mockCategories });

    const { result, waitForNextUpdate } = renderHook(() => CategoriesAPI());

    expect(result.current.categories[0]).toEqual([]);
    expect(result.current.callback[0]).toBeFalsy();

    await waitForNextUpdate();

    expect(axios.get).toHaveBeenCalledWith("/api/category");

    expect(result.current.categories[0]).toEqual(mockCategories);
    expect(result.current.callback[0]).toBeFalsy();
  });

  it("re-fetches categories when callback is triggered", async () => {
    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];

    axios.get.mockResolvedValueOnce({ data: mockCategories });

    const { result, waitForNextUpdate } = renderHook(() => CategoriesAPI());

    expect(result.current.categories[0]).toEqual([]);
    expect(result.current.callback[0]).toBeFalsy();

    await waitForNextUpdate();

    expect(axios.get).toHaveBeenCalledWith("/api/category");

    expect(result.current.categories[0]).toEqual(mockCategories);
    expect(result.current.callback[0]).toBeFalsy();

    axios.get.mockResolvedValueOnce({ data: [] });

    result.current.callback[1](true);

    await waitForNextUpdate();

    expect(axios.get).toHaveBeenCalledWith("/api/category");

    expect(result.current.categories[0]).toEqual([]);
    expect(result.current.callback[0]).toBeTruthy();
  });
});
