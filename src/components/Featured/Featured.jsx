import styles from "./Featured.module.scss";

const featured = [
  {
    id: "1",
    title: "Cozy stay in Porto",
    location: "Portugal",
    price: "700 kr",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Awesome place",
    location: "Italy",
    price: "3000 kr",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    title: "Dill og Dall",
    location: "Norway",
    price: "1400 kr",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Featured() {
  return (
    <section id="featured" className={styles.section}>
      <div className={styles.inner}>
        <h2>Find your perfect stay</h2>

        <div className={styles.grid}>
          {featured.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.media}>
                <img src={item.img} alt={item.title} />
              </div>

              <div className={styles.body}>
                <h3>{item.title}</h3>
                <p className={styles.meta}>{item.location}</p>
                <p className={styles.price}>{item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
