// src/pages/Admin/Admin.jsx
import { getAuth } from "../../utils/auth";

export default function Admin() {
  const { name } = getAuth();

  return (
    <main>
      <h1>Venue Manager</h1>
      <p>Welcome, {name} 👋</p>

      <section>
        <h2>Next steps</h2>
        <ul>
          <li>Add Venue</li>
          <li>My Venues</li>
          <li>Venue Bookings</li>
        </ul>
      </section>
    </main>
  );
}