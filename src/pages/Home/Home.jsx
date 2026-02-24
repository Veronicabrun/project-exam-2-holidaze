// src/pages/Home/Home.jsx
import { useEffect, useMemo, useState } from "react";
import Hero from "../../components/Hero/Hero";
import VenueCard from "../../components/VenueCard/VenueCard";
import { getVenues } from "../../services/venues";
import Loading from "../../components/ui/Loading/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage/ErrorMessage";
import useVenuesSearch from "../../hooks/useVenuesSearch";
import styles from "./Home.module.scss";

const NEWEST_LIMIT = 6;

export default function Home() {
  // ✅ Live search flyttet hit:
  const { query, setQuery, q, results, isSearching, error: searchError, clear } = useVenuesSearch();

  // Nyeste
  const [newest, setNewest] = useState([]);
  const [isLoadingNewest, setIsLoadingNewest] = useState(false);
  const [newestError, setNewestError] = useState("");

  // 1) Hent nyeste (kun én gang)
  useEffect(() => {
    let alive = true;

    async function loadNewest() {
      try {
        setNewestError("");
        setIsLoadingNewest(true);

        const data = await getVenues({
          page: 1,
          limit: NEWEST_LIMIT,
          sort: "created",
          sortOrder: "desc",
        });

        if (!alive) return;
        setNewest(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setNewestError(e?.message || "Could not load newest venues.");
      } finally {
        if (!alive) return;
        setIsLoadingNewest(false);
      }
    }

    loadNewest();
    return () => {
      alive = false;
    };
  }, []);

  // 2) Hva vises i grid?
  const listToShow = useMemo(() => {
    if (!q) return newest;
    return results;
  }, [q, newest, results]);

  // 3) Hvilken “loading” skal vises?
  const isLoading = q ? isSearching : isLoadingNewest;

  // 4) Hvilken error skal vises?
  const error = q ? searchError : newestError;

  return (
    <>
      {/* Hero unchanged */}
      <Hero query={query} onQueryChange={setQuery} />

      <section className={styles.section} aria-labelledby="results-title">
        <div className={styles.inner}>
          <div className={styles.header}>
            <h2 id="results-title" className={styles.title}>
              {q ? (
                <>
                  Search results for{" "}
                  <span className={styles.query}>&quot;{query.trim()}&quot;</span>
                </>
              ) : (
                "Newest venues"
              )}
            </h2>

            {q && (
              <button type="button" className={styles.clear} onClick={clear}>
                Clear search
              </button>
            )}
          </div>

          {error && <ErrorMessage message={error} />}

          {isLoading ? (
            <Loading text={q ? "Searching venues..." : "Loading venues..."} />
          ) : listToShow.length === 0 ? (
            <p className={styles.empty}>{q ? "No venues match your search." : "No venues yet."}</p>
          ) : (
            <ul className={styles.grid}>
              {listToShow.map((v) => (
                <li key={v.id}>
                  <VenueCard venue={v} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}