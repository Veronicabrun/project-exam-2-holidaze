// src/services/availability.js

export function toDateOnly(value) {
  // støtter både "YYYY-MM-DD" og ISO string fra API
  const datePart = String(value).slice(0, 10); // f.eks. "2026-05-15"
  return new Date(`${datePart}T00:00:00.000Z`);
}

export function rangesOverlap(startA, endA, startB, endB) {
  // [start, end) (end eksklusiv)
  return startA < endB && startB < endA;
}

export function isDateRangeAvailable({ dateFrom, dateTo, bookings = [] }) {
  if (!dateFrom || !dateTo) return true;

  const start = toDateOnly(dateFrom);
  const end = toDateOnly(dateTo);

  // hvis bruker velger samme dag eller “baklengs”
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
