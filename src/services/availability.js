// src/services/availability.js

export function toDateOnly(value) {
  // supports both "YYYY-MM-DD" and ISO string from API
  const datePart = String(value).slice(0, 10); // e.g. "2026-05-15"
  return new Date(`${datePart}T00:00:00.000Z`);
}

export function rangesOverlap(startA, endA, startB, endB) {
  // [start, end) (end exclusive)
  return startA < endB && startB < endA;
}

export function isDateRangeAvailable({ dateFrom, dateTo, bookings = [] }) {
  if (!dateFrom || !dateTo) return true;

  const start = toDateOnly(dateFrom);
  const end = toDateOnly(dateTo);

  // if user selects same day or “backwards”
  if (end <= start) return false;

  for (const b of bookings) {
    const bStart = toDateOnly(b.dateFrom);
    const bEnd = toDateOnly(b.dateTo);

    if (rangesOverlap(start, end, bStart, bEnd)) {
      return false;
    }
  }

  return true;
}
