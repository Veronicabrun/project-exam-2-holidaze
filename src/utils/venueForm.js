export const venueInitialValues = {
  name: "",
  description: "",
  mediaUrl: "",
  price: "",
  maxGuests: "",
  country: "",
};

export const venueAllTouched = {
  name: true,
  description: true,
  mediaUrl: true,
  price: true,
  maxGuests: true,
  country: true,
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
  if (!values.price) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(price) || price < 1) {
    errors.price = "Price must be a number (min 1).";
  }

  const maxGuests = Number(values.maxGuests);
  if (!values.maxGuests) {
    errors.maxGuests = "Max guests is required.";
  } else if (Number.isNaN(maxGuests) || maxGuests < 1) {
    errors.maxGuests = "Max guests must be a number (min 1).";
  }

  if (!values.country.trim()) errors.country = "Country is required.";

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
  };
}