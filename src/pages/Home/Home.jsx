import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Welcome to Holidaze</h1>
      <p>Find and book your perfect holiday venue.</p>

      <p>
        Test venue link: <Link to="/venue/123">Go to Venue 123</Link>
      </p>
    </div>
  );
}

