// Turns unknown data (rows read from restaurants.xlsx, or restaurants.json)
// into checked Restaurant objects. Used by the conversion script and by the page,
// so the rules live in one place. Throws if a row is missing a field or has a wrong value.

import type { PriceTier, Restaurant } from "../types/restaurant";

export const RESTAURANT_FIELDS = [
  "id",
  "name",
  "cuisine",
  "delivery_time_min",
  "price_tier",
  "is_vegetarian",
  "is_vegan",
  "is_gluten_free",
  "rating",
] as const;

type Field = (typeof RESTAURANT_FIELDS)[number];

function fail(where: string, message: string): never {
  throw new Error(`${where}: ${message}`);
}

// The sheet stores every cell as text ("28", "4.6"), so numbers can arrive as strings.
// Accept a real number or text that is exactly a number, nothing else.
function readNumber(value: unknown, where: string, field: Field): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    return Number(value.trim());
  }
  fail(where, `${field} must be a number, got ${JSON.stringify(value)}`);
}

function readText(value: unknown, where: string, field: Field): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(where, `${field} must be non-empty text, got ${JSON.stringify(value)}`);
  }
  return value.trim();
}

function readBoolean(value: unknown, where: string, field: Field): boolean {
  if (typeof value === "boolean") return value;
  const text = typeof value === "string" ? value.trim().toLowerCase() : value;
  if (text === "true") return true;
  if (text === "false") return false;
  fail(where, `${field} must be true or false, got ${JSON.stringify(value)}`);
}

function readPriceTier(value: unknown, where: string): PriceTier {
  const n = readNumber(value, where, "price_tier");
  if (n === 1 || n === 2 || n === 3 || n === 4) return n;
  fail(where, `price_tier must be 1, 2, 3 or 4, got ${n}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseRestaurant(value: unknown, where: string): Restaurant {
  if (!isRecord(value)) fail(where, "row must be an object");

  const delivery = readNumber(value.delivery_time_min, where, "delivery_time_min");
  if (delivery <= 0) fail(where, `delivery_time_min must be above 0, got ${delivery}`);

  const rating = readNumber(value.rating, where, "rating");
  if (rating < 0 || rating > 5) fail(where, `rating must be between 0 and 5, got ${rating}`);

  return {
    id: readNumber(value.id, where, "id"),
    name: readText(value.name, where, "name"),
    cuisine: readText(value.cuisine, where, "cuisine"),
    delivery_time_min: delivery,
    price_tier: readPriceTier(value.price_tier, where),
    is_vegetarian: readBoolean(value.is_vegetarian, where, "is_vegetarian"),
    is_vegan: readBoolean(value.is_vegan, where, "is_vegan"),
    is_gluten_free: readBoolean(value.is_gluten_free, where, "is_gluten_free"),
    rating,
  };
}

export function parseRestaurants(value: unknown): Restaurant[] {
  if (!Array.isArray(value)) throw new Error("restaurants data must be a list");
  const restaurants = value.map((row: unknown, i) => parseRestaurant(row, `Restaurant ${i + 1}`));
  const ids = new Set(restaurants.map((r) => r.id));
  if (ids.size !== restaurants.length) throw new Error("Duplicate id found");
  return restaurants;
}
