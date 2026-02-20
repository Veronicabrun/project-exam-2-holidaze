import styles from "./Hero.module.scss";
import heroImg from "../../assets/images/hero.jpg";

export default function Hero() {
  return (
    <header className={styles.hero}>
      <img className={styles.image} src={heroImg} alt="" />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1>Welcome to Holidaze</h1>
        <p>Find and book your perfect holiday</p>
      </div>
    </header>
  );
}

