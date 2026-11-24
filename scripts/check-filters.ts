// Runs filterRestaurants on the four stacks from expected-results-check-table.md
// and compares the names with the table. Run with: npm run check:filters
// Exits with an error if any stack differs.

import { readFile } from "node:fs/promises";
import { filterRestaurants } from "../src/lib/filterRestaurants.ts";
import { parseRestaurants } from "../src/lib/parseRestaurants.ts";
import type { FilterState } from "../src/types/filters.ts";

interface Stack {
  label: string;
  filters: FilterState;
  expected: string[];
}

const row1 = [
  "Bombay Spice House",
  "Slice & Fire Pizza",
  "Green Bowl Kitchen",
  "Casa Oaxaca Taqueria",
  "Olive & Ember Mezze",
  "Leafline Salad Co.",
  "Mumbai Express Kitchen",
  "Via Roma Pasta Bar",
  "Barrio Bowls",
];

const STACKS: Stack[] = [
  {
    label: "1. Vegetarian + 30 min + $ or $$",
    filters: { delivery: 30, price: ["$", "$$"], dietary: ["vegetarian"], rating: null },
    expected: row1,
  },
  {
    label: "2. 30 min + $ or $$ + Vegetarian + Vegan + 4.0+",
    filters: { delivery: 30, price: ["$", "$$"], dietary: ["vegetarian", "vegan"], rating: 4.0 },
    expected: ["Bombay Spice House", "Green Bowl Kitchen", "Olive & Ember Mezze", "Barrio Bowls"],
  },
  {
    label: "3. Vegan + Gluten-free + $",
    filters: { delivery: null, price: ["$"], dietary: ["vegan", "gluten_free"], rating: null },
    expected: [],
  },
  {
    label: "4. Vegetarian + 30 min",
    filters: { delivery: 30, price: [], dietary: ["vegetarian"], rating: null },
    expected: [...row1, "Rooted Plant Kitchen", "Pad Thai Republic"],
  },
];

const data: unknown = JSON.parse(await readFile("src/data/restaurants.json", "utf8"));
const restaurants = parseRestaurants(data);

let failed = false;
for (const stack of STACKS) {
  const got = filterRestaurants(restaurants, stack.filters).map((r) => r.name).sort();
  const want = [...stack.expected].sort();
  const same = got.length === want.length && got.every((name, i) => name === want[i]);
  console.log(`${same ? "OK  " : "FAIL"} ${stack.label}: expected ${want.length}, got ${got.length}`);
  if (!same) {
    failed = true;
    console.log("  expected:", want.join(", "));
    console.log("  got:     ", got.join(", "));
  }
}
if (failed) process.exit(1);
