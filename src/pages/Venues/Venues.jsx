import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VenueCard from "../../components/VenueCard/VenueCard";
import Loading from "../../components/ui/Loading/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage/ErrorMessage";
import { getVenues } from "../../services/venues";
import useVenuesSearch from "../../hooks/useVenuesSearch";
import styles from "./Venues.module.scss";

const PAGE_SIZE = 20;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export default function Venues() {
  const [searchParams] = useSearchParams();
  const selectedCountry = searchParams.get("country") || "";

  const { query, setQuery, q, results, isSearching, error: searchError, clear } =
    useVenuesSearch();

  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoadingBrowse, setIsLoadingBrowse] = useState(false);
  const [browseError, setBrowseError] = useState("");

  async function load(pageToLoad) {
    try {
      setBrowseError("");
      setIsLoadingBrowse(true);

      const data = await getVenues({
        page: pageToLoad,
        limit: PAGE_SIZE,
        sort: "created",
        sortOrder: "desc",
      });

      const next = Array.isArray(data) ? data : [];

      setVenues((prev) => {
        const map = new Map(prev.map((v) => [v.id, v]));
        next.forEach((v) => map.set(v.id, v));
        return Array.from(map.values());
      });

      setHasMore(next.length === PAGE_SIZE);
      setPage(pageToLoad);
    } catch (err) {
      setBrowseError(err?.message || "Failed to load venues.");
    } finally {
      setIsLoadingBrowse(false);
    }
  }

  useEffect(() => {
    setVenues([]);
    setHasMore(true);
    load(1);
  }, []);

  const baseList = useMemo(() => {
    if (q) return results;
    return venues;
  }, [q, results, venues]);

  const filteredList = useMemo(() => {
    if (!selectedCountry) return baseList;

    return baseList.filter((venue) => {
      const country = venue?.location?.country || "";
      return normalize(country) === normalize(selectedCountry);
    });
  }, [baseList, selectedCountry]);

  const error = q ? searchError : browseError;
  const isLoading = q ? isSearching : isLoadingBrowse;

  const canLoadMore = !q && hasMore && !isLoadingBrowse;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {selectedCountry ? `Venues in ${selectedCountry}` : "Explore venues"}
          </h1>
          <p className={styles.subtitle}>
            {selectedCountry
              ? `Browse venues filtered by ${selectedCountry}.`
              : "Browse venues and click a card to view details and book."}
          </p>
        </header>

        <div className={styles.controls}>
          <label className={styles.srOnly} htmlFor="venues-search">
            Search venues
          </label>

          <input
            id="venues-search"
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, country..."
            type="search"
            autoComplete="off"
          />

          <div className={styles.statusRow}>
            <p className={styles.count}>
              Showing <strong>{filteredList.length}</strong>{" "}
              {q ? (
                <>
                  results · Filter: <span className={styles.query}>&quot;{query.trim()}&quot;</span>
                </>
              ) : selectedCountry ? (
                <>
                  venues in <span className={styles.query}>{selectedCountry}</span>
                </>
              ) : (
                <>loaded</>
              )}
            </p>

            {(q || selectedCountry) && (
              <div className={styles.actions}>
                {q && (
                  <button type="button" className={styles.clear} onClick={clear}>
                    Clear search
                  </button>
                )}

                {selectedCountry && (
                  <a href="/venues" className={styles.clear}>
                    Clear country
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <ErrorMessage message={error} />

        {isLoading && filteredList.length === 0 ? (
          <Loading text={q ? "Searching venues..." : "Loading venues..."} />
        ) : filteredList.length === 0 ? (
          <p className={styles.empty}>
            {selectedCountry
              ? `No venues found in ${selectedCountry}.`
              : q
              ? "No venues match your search."
              : "No venues found."}
          </p>
        ) : (
          <ul className={styles.grid} aria-label="Venues list">
            {filteredList.map((v) => (
              <li key={v.id}>
                <VenueCard venue={v} />
              </li>
            ))}
          </ul>
        )}

        {!q && !selectedCountry && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.loadMore}
              onClick={() => load(page + 1)}
              disabled={!canLoadMore}
            >
              {isLoadingBrowse ? "Loading..." : hasMore ? "Load more" : "No more venues"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}