import { RestaurantFilters } from "@/components/RestaurantFilters";
import { restaurants } from "@/data/loadRestaurants";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Restaurants</h1>
      <RestaurantFilters restaurants={restaurants} />
    </main>
  );
}
