// One row of data/restaurants.xlsx. Field names match the sheet's column names.
export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  delivery_time_min: number;
  price_tier: PriceTier;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  rating: number;
}

// price_tier in the sheet is 1 to 4.
export type PriceTier = 1 | 2 | 3 | 4;

// What the card and the price chips show. Only these four strings are allowed.
export type PriceBand = "$" | "$$" | "$$$" | "$$$$";

const PRICE_BANDS: Record<PriceTier, PriceBand> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};

export function toPriceBand(tier: PriceTier): PriceBand {
  return PRICE_BANDS[tier];
}
