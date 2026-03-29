import { useEffect, useMemo, useRef, useState } from "react";
import { getVenues } from "../services/venues";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_MAX_PAGES = 15;
const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Normalize a search value for case-insensitive matching.
 *
 * @param {string} value - Search input value.
 * @returns {string} Normalized value.
 */
function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

/**
 * Check whether a venue matches the search query.
 *
 * @param {Object} venue - Venue object.
 * @param {string} q - Normalized search query.
 * @returns {boolean} True if the venue matches the query.
 */
function matchesQuery(venue, q) {
  const hay = [
    venue?.name,
    venue?.description,
    venue?.location?.address,
    venue?.location?.city,
    venue?.location?.zip,
    venue?.location?.country,
    venue?.location?.continent,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return hay.includes(q);
}

/**
 * Search venues client-side by loading paginated results and filtering them.
 *
 * @param {Object} [options={}] - Hook options.
 * @param {number} [options.pageSize=20] - Number of venues fetched per page.
 * @param {number} [options.maxPages=15] - Maximum number of pages to search through.
 * @param {number} [options.debounceMs=300] - Debounce delay before search starts.
 * @returns {Object} Search state and actions.
 */
export default function useVenuesSearch(options = {}) {
  const {
    pageSize = DEFAULT_PAGE_SIZE,
    maxPages = DEFAULT_MAX_PAGES,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const requestIdRef = useRef(0);

  const q = useMemo(() => normalize(query), [query]);

  useEffect(() => {
    if (!q) {
      setResults([]);
      setError("");
      setIsSearching(false);
      return;
    }

    const myRequestId = ++requestIdRef.current;

    const timer = setTimeout(() => {
      (async () => {
        try {
          setError("");
          setIsSearching(true);
          setResults([]);

          const all = [];
          let page = 1;
          let hasMore = true;

          while (hasMore && page <= maxPages) {
            if (requestIdRef.current !== myRequestId) return;

            const data = await getVenues({
              page,
              limit: pageSize,
              sort: "created",
              sortOrder: "desc",
            });

            const next = Array.isArray(data) ? data : [];
            all.push(...next);

            const filtered = all.filter((venue) => matchesQuery(venue, q));
            setResults(filtered);

            hasMore = next.length === pageSize;
            page += 1;
          }
        } catch (e) {
          if (requestIdRef.current !== myRequestId) return;
          setError(e?.message || "Search failed.");
        } finally {
          if (requestIdRef.current !== myRequestId) return;
          setIsSearching(false);
        }
      })();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [q, pageSize, maxPages, debounceMs]);

  /**
   * Clear the current search query.
   */
  function clear() {
    setQuery("");
  }

  return {
    query,
    setQuery,
    q,
    results,
    isSearching,
    error,
    clear,
  };
}