// The one filter function for the restaurant list.
// Pure: it reads its two inputs, changes neither of them, and returns a new list.
// The rules come from the Figma wireframe notes:
// - Delivery: one chip; passes if delivery_time_min is at most that number (exactly 30 passes 30).
// - Price: any number of chips; passes if the price matches at least one (OR).
// - Dietary: any number of chips; passes only if every selected tag is true (AND).
// - Rating: one chip; passes if rating is at least that number (exactly 4.0 passes 4.0+).
// - A group with nothing selected lets every restaurant through.
// - A restaurant is kept only if it passes all four groups (AND between groups).

import type { DietaryTag, FilterState } from "../types/filters";
import type { Restaurant } from "../types/restaurant";
import { toPriceBand } from "../types/restaurant.ts";

function hasTag(r: Restaurant, tag: DietaryTag): boolean {
  switch (tag) {
    case "vegetarian":
      return r.is_vegetarian;
    case "vegan":
      return r.is_vegan;
    case "gluten_free":
      return r.is_gluten_free;
  }
}

export function filterRestaurants(
  restaurants: readonly Restaurant[],
  filters: FilterState,
): Restaurant[] {
  return restaurants.filter((r) => {
    const passesDelivery =
      filters.delivery === null || r.delivery_time_min <= filters.delivery;
    const passesPrice =
      filters.price.length === 0 || filters.price.includes(toPriceBand(r.price_tier));
    const passesDietary = filters.dietary.every((tag) => hasTag(r, tag));
    const passesRating = filters.rating === null || r.rating >= filters.rating;
    return passesDelivery && passesPrice && passesDietary && passesRating;
  });
}
