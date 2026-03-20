import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton/ScrollToTopButton";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";

function Layout() {
  return (
    <div className={styles.shell}>
      <Nav />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default Layout;