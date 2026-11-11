import type { PriceBand } from "./restaurant";

// Chip values for each group, matching the Figma wireframe.
export type DeliveryChip = 15 | 30 | 45;
export type RatingChip = 3.5 | 4.0 | 4.5;
export type DietaryTag = "vegetarian" | "vegan" | "gluten_free";

// Nothing selected:
// - one-choice groups (delivery, rating) use null
// - multi-choice groups (price, dietary) use an empty list []
export interface FilterState {
  delivery: DeliveryChip | null;
  price: PriceBand[];
  dietary: DietaryTag[];
  rating: RatingChip | null;
}

export const EMPTY_FILTERS: FilterState = {
  delivery: null,
  price: [],
  dietary: [],
  rating: null,
};
