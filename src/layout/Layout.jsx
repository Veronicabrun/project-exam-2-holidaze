// src/layout/Layout.jsx
import Nav from "../components/Nav/Nav";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";

function Layout() {
  return (
    <div className={styles.shell}>
      <Nav />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
