import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getVenues } from "../../services/venues";

const PAGE_SIZE = 20;

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(pageToLoad) {
    try {
      setError("");
      setIsLoading(true);

      const data = await getVenues({
        page: pageToLoad,
        limit: PAGE_SIZE,
        sort: "created",
        sortOrder: "desc",
      });

      const next = Array.isArray(data) ? data : [];

      // Append + de-dupe (viktig når man paginerer)
      setVenues((prev) => {
        const map = new Map(prev.map((v) => [v.id, v]));
        next.forEach((v) => map.set(v.id, v));
        return Array.from(map.values());
      });

      // Hvis vi fikk færre enn PAGE_SIZE -> ingen flere sider
      setHasMore(next.length === PAGE_SIZE);
      setPage(pageToLoad);
    } catch (err) {
      setError(err?.message || "Failed to load venues");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // start på nytt (page 1)
    setVenues([]);
    setHasMore(true);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredVenues = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return venues;
    return venues.filter((v) => v.name?.toLowerCase().includes(q));
  }, [venues, query]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Venues</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search venues..."
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 10,
          margin: "12px 0",
          border: "1px solid #ddd",
          borderRadius: 6,
        }}
      />

      {error && <p style={{ padding: "0.5rem 0", color: "crimson" }}>{error}</p>}

      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Showing {filteredVenues.length} loaded
      </p>

      {filteredVenues.length === 0 && !isLoading ? (
        <p>No venues found.</p>
      ) : (
        <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
          {filteredVenues.map((v) => (
            <li key={v.id} style={{ border: "1px solid #ddd", padding: 12 }}>
              <h3 style={{ margin: 0 }}>{v.name}</h3>
              <p style={{ margin: "6px 0" }}>Price: {v.price}</p>
              <p style={{ margin: "6px 0" }}>Max guests: {v.maxGuests}</p>
              <Link to={`/venue/${v.id}`}>View venue</Link>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => load(page + 1)}
          disabled={isLoading || !hasMore}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            background: isLoading || !hasMore ? "#ddd" : "#111",
            color: isLoading || !hasMore ? "#333" : "#fff",
            cursor: isLoading || !hasMore ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Loading..." : hasMore ? "Load more" : "No more venues"}
        </button>
      </div>
    </div>
  );
}
