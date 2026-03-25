import React from "react";
import { render, screen } from "@testing-library/react";
import VenueCard from "./VenueCard";

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ children, to, ...rest }) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
  }),
  { virtual: true }
);

function renderVenueCard(overrides = {}) {
  const venue = {
    id: "venue-123",
    name: "Bali Retreat",
    price: 599,
    maxGuests: 4,
    location: {
      city: "Bali",
      country: "Indonesia",
    },
    media: [
      {
        url: "https://placehold.co/900x600?text=Venue",
        alt: "Bali Retreat image",
      },
    ],
    ...overrides,
  };

  render(<VenueCard venue={venue} />);
  return { venue };
}

describe("VenueCard", () => {
  test("renders venue name", () => {
    const { venue } = renderVenueCard();

    expect(
      screen.getByRole("heading", { name: venue.name })
    ).toBeInTheDocument();
  });

  test("renders price, guests and location", () => {
    renderVenueCard();

    expect(screen.getByText("$599")).toBeInTheDocument();
    expect(screen.getByText("/ night")).toBeInTheDocument();
    expect(screen.getByText("4 guests")).toBeInTheDocument();
    expect(screen.getByText("Bali, Indonesia")).toBeInTheDocument();
  });

  test("links to the correct venue page", () => {
    const { venue } = renderVenueCard();

    const link = screen.getByRole("link", {
      name: `View ${venue.name}`,
    });

    expect(link).toHaveAttribute("href", `/venue/${venue.id}`);
  });

  test("uses fallback location text when city and country are missing", () => {
    renderVenueCard({
      location: {
        city: "",
        country: "",
      },
    });

    expect(screen.getByText("Somewhere in the world")).toBeInTheDocument();
  });

  test("uses fallback image alt text when alt is missing", () => {
    renderVenueCard({
      media: [
        {
          url: "https://placehold.co/900x600?text=Venue",
          alt: "",
        },
      ],
    });

    expect(screen.getByAltText("Bali Retreat")).toBeInTheDocument();
  });
});