import { RestaurantCard } from "@/components/RestaurantCard";
import { restaurants } from "@/data/restaurants";
import styles from "./page.module.css";

function countLine(n: number): string {
  if (n === 0) return "No restaurants match";
  if (n === 1) return "1 restaurant matches";
  return `${n} restaurants match`;
}

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Restaurants</h1>
      <p className={styles.count}>{countLine(restaurants.length)}</p>
      <div className={styles.grid}>
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </main>
  );
}
