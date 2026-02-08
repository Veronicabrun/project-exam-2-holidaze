export function toDateOnly(value) {
  // value kan være "2026-01-30" eller ISO string fra API
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function rangesOverlap(startA, endA, startB, endB) {
  // Vi bruker [start, end) (end er eksklusiv) som er vanlig i booking
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
