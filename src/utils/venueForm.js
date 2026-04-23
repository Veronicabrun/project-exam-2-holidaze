export const venueInitialValues = {
  name: "",
  description: "",
  mediaUrl: "",
  price: "",
  maxGuests: "",
  country: "",
  rating: "",
  wifi: false,
  pets: false,
};

export const venueAllTouched = {
  name: true,
  description: true,
  mediaUrl: true,
  price: true,
  maxGuests: true,
  country: true,
  rating: true,
};

export function validateVenue(values, { mediaRequired = true } = {}) {
  const errors = {};

  if (!values.name.trim()) errors.name = "Venue name is required.";
  if (!values.description.trim()) errors.description = "Description is required.";

  if (mediaRequired && !values.mediaUrl.trim()) {
    errors.mediaUrl = "Media URL is required.";
  } else if (values.mediaUrl.trim()) {
    try {
      new URL(values.mediaUrl);
    } catch {
      errors.mediaUrl = "Media URL must be a valid URL.";
    }
  }

  const price = Number(values.price);
  if (!values.price && values.price !== 0) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(price) || price < 1) {
    errors.price = "Price must be a number (min 1).";
  }

  const maxGuests = Number(values.maxGuests);
  if (!values.maxGuests && values.maxGuests !== 0) {
    errors.maxGuests = "Max guests is required.";
  } else if (Number.isNaN(maxGuests) || maxGuests < 1) {
    errors.maxGuests = "Max guests must be a number (min 1).";
  }

  if (!values.country.trim()) errors.country = "Country is required.";

  if (String(values.rating).trim()) {
    const rating = Number(values.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      errors.rating = "Rating must be a number between 0 and 5.";
    }
  }

  return errors;
}

export function buildVenuePayload(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    media: values.mediaUrl.trim()
      ? [
          {
            url: values.mediaUrl.trim(),
            alt: values.name.trim() || "Venue image",
          },
        ]
      : [],
    price: Number(values.price),
    maxGuests: Number(values.maxGuests),
    rating: String(values.rating).trim() ? Number(values.rating) : 0,
    meta: {
      wifi: Boolean(values.wifi),
      pets: Boolean(values.pets),
    },
    location: {
      country: values.country.trim(),
    },
  };
}

export function toVenueInitialValues(venue) {
  return {
    name: venue?.name || "",
    description: venue?.description || "",
    mediaUrl: venue?.media?.[0]?.url || "",
    price: venue?.price ?? "",
    maxGuests: venue?.maxGuests ?? "",
    country: venue?.location?.country || "",
    rating:
      typeof venue?.rating === "number" && venue.rating !== 0
        ? String(venue.rating)
        : "",
    wifi: Boolean(venue?.meta?.wifi),
    pets: Boolean(venue?.meta?.pets),
  };
}