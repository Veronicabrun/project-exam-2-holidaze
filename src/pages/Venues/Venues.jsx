import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getVenues } from "../../services/venues";

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        setIsLoading(true);

        console.log("Loading venues...");
        const response = await getVenues();
        console.log("Raw venues response:", response);

        // Noroff v2: liste ligger i response.data
        setVenues(response.data || []);
      } catch (err) {
        console.error("Venues error:", err);
        setError(err.message || "Failed to load venues");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const filteredVenues = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return venues;

    return venues.filter((v) => v.name?.toLowerCase().includes(q));
  }, [venues, query]);

  if (isLoading) return <p style={{ padding: "1rem" }}>Loading venues...</p>;
  if (error) return <p style={{ padding: "1rem", color: "crimson" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Venues</h1>

      {/* Search */}
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

      {/* Result info */}
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Showing {filteredVenues.length} of {venues.length}
      </p>

      {filteredVenues.length === 0 ? (
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
    </div>
  );
}
