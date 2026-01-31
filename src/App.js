// src/App.js
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import VenueManagerRoute from "./components/VenueManagerRoute/VenueManagerRoute";

import Layout from "./layout/Layout/Layout";

import Home from "./pages/Home/Home";
import Venues from "./pages/Venues/Venues";
import Venue from "./pages/Venue/Venue";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Admin from "./pages/Admin/Admin";

export default function App() {
  console.log("App.js:17 App rendered");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="venues" element={<Venues />} />

        {/* Viktig: denne må matche Linkene dine: /venue/:id */}
        <Route path="venue/:id" element={<Venue />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Venue Manager only */}
        <Route
          path="admin"
          element={
            <VenueManagerRoute>
              <Admin />
            </VenueManagerRoute>
          }
        />

        <Route path="*" element={<p>Not found</p>} />
      </Route>
    </Routes>
  );
}