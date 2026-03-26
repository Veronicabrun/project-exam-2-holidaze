import { renderHook, waitFor, act } from "@testing-library/react";
import useVenuesSearch from "./useVenuesSearch";
import { getVenues } from "../services/venues";

jest.mock("../services/venues", () => ({
  getVenues: jest.fn(),
}));

describe("useVenuesSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns empty results when query is empty", () => {
    const { result } = renderHook(() => useVenuesSearch());

    expect(result.current.query).toBe("");
    expect(result.current.q).toBe("");
    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.error).toBe("");
  });

  test("searches venues and returns matching results", async () => {
    getVenues.mockResolvedValue([
      {
        id: "1",
        name: "Japan Retreat",
        description: "Beautiful stay in Tokyo",
        location: { country: "Japan", city: "Tokyo" },
      },
      {
        id: "2",
        name: "Spain Villa",
        description: "Sunny place in Spain",
        location: { country: "Spain", city: "Madrid" },
      },
    ]);

    const { result } = renderHook(() =>
      useVenuesSearch({ debounceMs: 0, maxPages: 1 })
    );

    act(() => {
      result.current.setQuery("japan");
    });

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
    });

    expect(result.current.results[0].name).toBe("Japan Retreat");
    expect(getVenues).toHaveBeenCalledTimes(1);
  });

  test("sets error when search request fails", async () => {
    getVenues.mockRejectedValue(new Error("Search failed badly"));

    const { result } = renderHook(() =>
      useVenuesSearch({ debounceMs: 0, maxPages: 1 })
    );

    act(() => {
      result.current.setQuery("japan");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Search failed badly");
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  test("clear resets the query", async () => {
    const { result } = renderHook(() =>
      useVenuesSearch({ debounceMs: 0, maxPages: 1 })
    );

    act(() => {
      result.current.setQuery("italy");
    });

    await waitFor(() => {
      expect(result.current.query).toBe("italy");
    });

    act(() => {
      result.current.clear();
    });

    await waitFor(() => {
      expect(result.current.query).toBe("");
      expect(result.current.q).toBe("");
    });
  });
});