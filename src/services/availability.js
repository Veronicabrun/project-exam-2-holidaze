/**
 * Convert a date value into a UTC date using only the YYYY-MM-DD part.
 *
 * Supports both plain YYYY-MM-DD strings and ISO strings from the API.
 *
 * @param {string|Date} value - Date value to convert.
 * @returns {Date} UTC-normalized date object.
 */
export function toDateOnly(value) {
  const datePart = String(value).slice(0, 10);
  return new Date(`${datePart}T00:00:00.000Z`);
}

/**
 * Check whether two date ranges overlap.
 *
 * Uses [start, end) logic, where the end date is exclusive.
 *
 * @param {Date} startA - Start of first range.
 * @param {Date} endA - End of first range.
 * @param {Date} startB - Start of second range.
 * @param {Date} endB - End of second range.
 * @returns {boolean} True if the ranges overlap.
 */
export function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

/**
 * Check whether a selected booking range is available.
 *
 * @param {Object} params - Availability check params.
 * @param {string} params.dateFrom - Check-in date in YYYY-MM-DD format.
 * @param {string} params.dateTo - Check-out date in YYYY-MM-DD format.
 * @param {Array<Object>} [params.bookings=[]] - Existing bookings.
 * @returns {boolean} True if the selected range is available.
 */
export function isDateRangeAvailable({ dateFrom, dateTo, bookings = [] }) {
  if (!dateFrom || !dateTo) return true;

  const start = toDateOnly(dateFrom);
  const end = toDateOnly(dateTo);

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