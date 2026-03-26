import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Venues from "./Venues";
import { getVenues } from "../../services/venues";
import useVenuesSearch from "../../hooks/useVenuesSearch";

jest.mock("../../services/venues", () => ({
  getVenues: jest.fn(),
}));

jest.mock("../../hooks/useVenuesSearch", () => jest.fn());

jest.mock("../../components/VenueCard/VenueCard", () => ({ venue }) => (
  <div>{venue.name}</div>
));

jest.mock("../../components/ui/Loading/Loading", () => ({ text }) => (
  <div>{text}</div>
));

jest.mock("../../components/ui/ErrorMessage/ErrorMessage", () => ({ message }) =>
  message ? <div>{message}</div> : null
);

jest.mock(
  "react-router-dom",
  () => ({
    useSearchParams: () => [new URLSearchParams("")],
  }),
  { virtual: true }
);

describe("Venues page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useVenuesSearch.mockReturnValue({
      query: "",
      setQuery: jest.fn(),
      q: "",
      results: [],
      isSearching: false,
      error: "",
      clear: jest.fn(),
    });
  });

  test("renders venues from browse data", async () => {
    getVenues.mockResolvedValue([
      {
        id: "1",
        name: "Japan Retreat",
        location: { country: "Japan" },
      },
      {
        id: "2",
        name: "Spain Villa",
        location: { country: "Spain" },
      },
    ]);

    await act(async () => {
      render(<Venues />);
    });

    expect(await screen.findByText("Japan Retreat")).toBeInTheDocument();
    expect(await screen.findByText("Spain Villa")).toBeInTheDocument();
  });

  test("renders loading state while search is loading", () => {
    useVenuesSearch.mockReturnValue({
      query: "japan",
      setQuery: jest.fn(),
      q: "japan",
      results: [],
      isSearching: true,
      error: "",
      clear: jest.fn(),
    });

    render(<Venues />);

    expect(screen.getByText("Searching venues...")).toBeInTheDocument();
  });

  test("renders empty state when no venues are found", async () => {
    getVenues.mockResolvedValue([]);

    await act(async () => {
      render(<Venues />);
    });

    expect(await screen.findByText("No venues found.")).toBeInTheDocument();
  });

  test("renders search results from hook when query exists", () => {
    useVenuesSearch.mockReturnValue({
      query: "japan",
      setQuery: jest.fn(),
      q: "japan",
      results: [
        {
          id: "1",
          name: "Japan Retreat",
          location: { country: "Japan" },
        },
      ],
      isSearching: false,
      error: "",
      clear: jest.fn(),
    });

    render(<Venues />);

    expect(screen.getByText("Japan Retreat")).toBeInTheDocument();
    expect(screen.getByText(/results/i)).toBeInTheDocument();
  });

  test("renders browse error message when venue loading fails", async () => {
    getVenues.mockRejectedValue(new Error("Failed to load venues."));

    await act(async () => {
      render(<Venues />);
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to load venues.")).toBeInTheDocument();
    });
  });
});