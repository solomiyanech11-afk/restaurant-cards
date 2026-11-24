"use client";

// Filter panel + live count + card list. Holds the filter state.
// Every chip click updates the state, and the list and count are worked out again
// from filterRestaurants() on the same render. No Apply button, no reload.

import { useState } from "react";
import { filterRestaurants } from "@/lib/filterRestaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import type {
  DeliveryChip,
  DietaryTag,
  FilterState,
  RatingChip,
} from "@/types/filters";
import { EMPTY_FILTERS } from "@/types/filters";
import type { PriceBand, Restaurant } from "@/types/restaurant";
import styles from "./RestaurantFilters.module.css";

interface Props {
  restaurants: Restaurant[];
}

const DELIVERY_CHIPS: DeliveryChip[] = [15, 30, 45];
const PRICE_CHIPS: PriceBand[] = ["$", "$$", "$$$", "$$$$"];
const DIETARY_CHIPS: { tag: DietaryTag; label: string }[] = [
  { tag: "vegetarian", label: "Vegetarian" },
  { tag: "vegan", label: "Vegan" },
  { tag: "gluten_free", label: "Gluten-free" },
];
const RATING_CHIPS: RatingChip[] = [3.5, 4.0, 4.5];

function countLine(n: number): string {
  if (n === 0) return "No restaurants match";
  if (n === 1) return "1 restaurant matches";
  return `${n} restaurants match`;
}

// Adds the value if it is not in the list, removes it if it is.
function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function dietaryLabel(tag: DietaryTag): string {
  return DIETARY_CHIPS.find((c) => c.tag === tag)?.label ?? tag;
}

// "30 min, $ or $$, Vegetarian, 4.0+" — in the same order as the panel.
function activeFiltersText(f: FilterState): string {
  const parts: string[] = [];
  if (f.delivery !== null) parts.push(`${f.delivery} min`);
  if (f.price.length > 0) {
    const ordered = PRICE_CHIPS.filter((p) => f.price.includes(p));
    parts.push(ordered.join(" or "));
  }
  for (const c of DIETARY_CHIPS) {
    if (f.dietary.includes(c.tag)) parts.push(dietaryLabel(c.tag));
  }
  if (f.rating !== null) parts.push(`${f.rating.toFixed(1)}+`);
  return parts.join(", ");
}

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={selected ? `${styles.chip} ${styles.chipOn}` : styles.chip}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function RestaurantFilters({ restaurants }: Props) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  // The count comes from this list — nothing is tracked separately.
  const visible = filterRestaurants(restaurants, filters);
  const active = activeFiltersText(filters);

  return (
    <>
      <section className={styles.panel} aria-label="Filters">
        <div className={styles.row}>
          <span className={styles.groupLabel}>Delivery time</span>
          {DELIVERY_CHIPS.map((min) => (
            <Chip
              key={min}
              label={`${min}min`}
              selected={filters.delivery === min}
              onClick={() =>
                setFilters((f) => ({ ...f, delivery: f.delivery === min ? null : min }))
              }
            />
          ))}
        </div>
        <div className={styles.row}>
          <span className={styles.groupLabel}>Price</span>
          {PRICE_CHIPS.map((band) => (
            <Chip
              key={band}
              label={band}
              selected={filters.price.includes(band)}
              onClick={() => setFilters((f) => ({ ...f, price: toggle(f.price, band) }))}
            />
          ))}
        </div>
        <div className={styles.row}>
          <span className={styles.groupLabel}>Dietary</span>
          {DIETARY_CHIPS.map(({ tag, label }) => (
            <Chip
              key={tag}
              label={label}
              selected={filters.dietary.includes(tag)}
              onClick={() => setFilters((f) => ({ ...f, dietary: toggle(f.dietary, tag) }))}
            />
          ))}
        </div>
        <div className={styles.row}>
          <span className={styles.groupLabel}>Rating</span>
          {RATING_CHIPS.map((min) => (
            <Chip
              key={min}
              label={`${min.toFixed(1)}+`}
              selected={filters.rating === min}
              onClick={() =>
                setFilters((f) => ({ ...f, rating: f.rating === min ? null : min }))
              }
            />
          ))}
        </div>
      </section>

      <p className={styles.count} aria-live="polite">
        {countLine(visible.length)}
      </p>
      {active !== "" && <p className={styles.active}>Active filters: {active}.</p>}

      {visible.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            No restaurants match all your filters.
            <br />
            Try removing one.
          </p>
          <button
            type="button"
            className={styles.clear}
            onClick={() => setFilters(EMPTY_FILTERS)}
          >
            Clear all
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {visible.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </>
  );
}
