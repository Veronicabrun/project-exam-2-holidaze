import {
  toDateOnly,
  rangesOverlap,
  isDateRangeAvailable,
} from "./availability";

describe("availability service", () => {
  test("toDateOnly returns a date with the correct YYYY-MM-DD value", () => {
    const result = toDateOnly("2026-05-15");
    expect(result.toISOString().slice(0, 10)).toBe("2026-05-15");
  });

  test("rangesOverlap returns true when two ranges overlap", () => {
    const startA = new Date("2026-05-10T00:00:00.000Z");
    const endA = new Date("2026-05-15T00:00:00.000Z");
    const startB = new Date("2026-05-14T00:00:00.000Z");
    const endB = new Date("2026-05-18T00:00:00.000Z");

    expect(rangesOverlap(startA, endA, startB, endB)).toBe(true);
  });

  test("rangesOverlap returns false when two ranges do not overlap", () => {
    const startA = new Date("2026-05-10T00:00:00.000Z");
    const endA = new Date("2026-05-15T00:00:00.000Z");
    const startB = new Date("2026-05-15T00:00:00.000Z");
    const endB = new Date("2026-05-18T00:00:00.000Z");

    expect(rangesOverlap(startA, endA, startB, endB)).toBe(false);
  });

  test("isDateRangeAvailable returns false when selected range overlaps an existing booking", () => {
    const bookings = [
      {
        dateFrom: "2026-05-10",
        dateTo: "2026-05-15",
      },
    ];

    const result = isDateRangeAvailable({
      dateFrom: "2026-05-12",
      dateTo: "2026-05-14",
      bookings,
    });

    expect(result).toBe(false);
  });

  test("isDateRangeAvailable returns true when selected range does not overlap", () => {
    const bookings = [
      {
        dateFrom: "2026-05-10",
        dateTo: "2026-05-15",
      },
    ];

    const result = isDateRangeAvailable({
      dateFrom: "2026-05-16",
      dateTo: "2026-05-18",
      bookings,
    });

    expect(result).toBe(true);
  });

  test("isDateRangeAvailable returns false when check-out is the same as check-in", () => {
    const result = isDateRangeAvailable({
      dateFrom: "2026-05-12",
      dateTo: "2026-05-12",
      bookings: [],
    });

    expect(result).toBe(false);
  });

  test("isDateRangeAvailable returns true when dates are empty", () => {
    const result = isDateRangeAvailable({
      dateFrom: "",
      dateTo: "",
      bookings: [],
    });

    expect(result).toBe(true);
  });
});