// src/pages/Venues/Venues.jsx
import { useEffect, useMemo, useState } from "react";
import VenueCard from "../../components/VenueCard/VenueCard";
import Loading from "../../components/ui/Loading/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage/ErrorMessage";
import { getVenues } from "../../services/venues";
import useVenuesSearch from "../../hooks/useVenuesSearch";
import styles from "./Venues.module.scss";

const PAGE_SIZE = 20;

export default function Venues() {
  // ✅ Live search (samme som Home)
  const { query, setQuery, q, results, isSearching, error: searchError, clear } = useVenuesSearch();

  // ✅ Browse-list (når query er tom)
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

      // Append + de-dupe
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

  // initial load for browse
  useEffect(() => {
    setVenues([]);
    setHasMore(true);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hvilken liste viser vi?
  const listToShow = useMemo(() => {
    if (q) return results;     // live search mode
    return venues;             // browse mode
  }, [q, results, venues]);

  // Hvilken error / loading gjelder?
  const error = q ? searchError : browseError;
  const isLoading = q ? isSearching : isLoadingBrowse;

  const canLoadMore = !q && hasMore && !isLoadingBrowse;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Explore venues</h1>
          <p className={styles.subtitle}>Browse venues and click a card to view details and book.</p>
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
              Showing <strong>{listToShow.length}</strong>{" "}
              {q ? (
                <>
                  results · Filter: <span className={styles.query}>&quot;{query.trim()}&quot;</span>
                </>
              ) : (
                <>loaded</>
              )}
            </p>

            {q && (
              <button type="button" className={styles.clear} onClick={clear}>
                Clear
              </button>
            )}
          </div>
        </div>

        <ErrorMessage message={error} />

        {isLoading && listToShow.length === 0 ? (
          <Loading text={q ? "Searching venues..." : "Loading venues..."} />
        ) : listToShow.length === 0 ? (
          <p className={styles.empty}>{q ? "No venues match your search." : "No venues found."}</p>
        ) : (
          <ul className={styles.grid} aria-label="Venues list">
            {listToShow.map((v) => (
              <li key={v.id}>
                <VenueCard venue={v} />
              </li>
            ))}
          </ul>
        )}

        {/* Load more kun i browse-mode */}
        {!q && (
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