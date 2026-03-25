// src/hooks/useVenuesSearch.js
import { useEffect, useMemo, useRef, useState } from "react";
import { getVenues } from "../services/venues";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_MAX_PAGES = 15;
const DEFAULT_DEBOUNCE_MS = 300;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

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