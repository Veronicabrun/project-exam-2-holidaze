import { useEffect, useMemo, useRef, useState } from "react";
import Hero from "../../components/Hero/Hero";
import VenueCard from "../../components/VenueCard/VenueCard";
import { getVenues } from "../../services/venues";
import Loading from "../../components/ui/Loading/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage/ErrorMessage";
import styles from "./Home.module.scss";


const NEWEST_LIMIT = 6;
const SEARCH_PAGE_SIZE = 20;
const MAX_SEARCH_PAGES = 15; // sikkerhet, så vi ikke henter “uendelig”

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

export default function Home() {
  const [query, setQuery] = useState("");

  // Nyeste (8)
  const [newest, setNewest] = useState([]);

  // Search results (kan være mange)
  const [searchVenues, setSearchVenues] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const requestIdRef = useRef(0);

  // 1) Hent 8 nyeste (kun én gang / ved refresh)
  useEffect(() => {
    let alive = true;

    async function loadNewest() {
      try {
        setError("");
        setIsLoading(true);

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
        setError(e?.message || "Could not load newest venues.");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    }

    loadNewest();
    return () => {
      alive = false;
    };
  }, []);

  // 2) “Live search” med debounce: når query endres, hent flere sider ved behov
  useEffect(() => {
    const q = normalize(query);

    // Hvis tomt søk: vis bare 8 nyeste (og nullstill search state)
    if (!q) {
      setSearchVenues([]);
      setError("");
      return;
    }

    const myRequestId = ++requestIdRef.current;
    const timer = setTimeout(() => {
      (async () => {
        try {
          setError("");
          setIsLoading(true);
          setSearchVenues([]);

          const all = [];
          let page = 1;
          let hasMore = true;

          while (hasMore && page <= MAX_SEARCH_PAGES) {
            // Hvis en nyere request har startet, avbryt denne
            if (requestIdRef.current !== myRequestId) return;

            const data = await getVenues({
              page,
              limit: SEARCH_PAGE_SIZE,
              sort: "created",
              sortOrder: "desc",
            });

            const next = Array.isArray(data) ? data : [];
            all.push(...next);

            // Filter på alt vi har hentet så langt
            const filtered = all.filter((v) => matchesQuery(v, q));
            setSearchVenues(filtered);

            // Ferdig når færre enn page-size returneres
            hasMore = next.length === SEARCH_PAGE_SIZE;
            page += 1;

            // Hvis vi allerede har treff, kan vi stoppe tidlig (UX: raskere)
            if (filtered.length > 0) break;
          }

          // Hvis vi stoppet tidlig uten treff, men fortsatt kan finnes langt ned:
          // du kan fjerne “break” over hvis du vil søke absolutt ALT alltid.
        } catch (e) {
          if (requestIdRef.current !== myRequestId) return;
          setError(e?.message || "Search failed.");
        } finally {
          if (requestIdRef.current !== myRequestId) return;
          setIsLoading(false);
        }
      })();
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  const q = normalize(query);
  const listToShow = useMemo(() => {
    if (!q) return newest;
    return searchVenues;
  }, [q, newest, searchVenues]);

  return (
    <>
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
              <button type="button" className={styles.clear} onClick={() => setQuery("")}>
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