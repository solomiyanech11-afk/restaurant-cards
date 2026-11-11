import type { Restaurant } from "@/types/restaurant";
import { toPriceBand } from "@/types/restaurant";
import styles from "./RestaurantCard.module.css";

interface Props {
  restaurant: Restaurant;
}

function dietaryTags(r: Restaurant): string[] {
  const tags: string[] = [];
  if (r.is_vegetarian) tags.push("Vegetarian");
  if (r.is_vegan) tags.push("Vegan");
  if (r.is_gluten_free) tags.push("Gluten-free");
  return tags;
}

export function RestaurantCard({ restaurant }: Props) {
  const tags = dietaryTags(restaurant);

  return (
    <article className={styles.card}>
      <div className={styles.image} aria-hidden="true" />
      <h2 className={styles.name}>{restaurant.name}</h2>
      <p className={styles.meta}>
        <span>{restaurant.cuisine}</span>
        <span aria-label={`Price ${restaurant.price_tier} of 4`}>
          {toPriceBand(restaurant.price_tier)}
        </span>
        <span aria-label={`Rating ${restaurant.rating.toFixed(1)}`}>
          ★ {restaurant.rating.toFixed(1)}
        </span>
        <span>{restaurant.delivery_time_min} min</span>
      </p>
      {tags.length > 0 && (
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
