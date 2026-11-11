// The page's data: src/data/restaurants.json (generated from data/restaurants.xlsx
// by `npm run data`), checked row by row into typed Restaurant objects.

import data from "./restaurants.json";
import { parseRestaurants } from "@/lib/parseRestaurants";
import type { Restaurant } from "@/types/restaurant";

export const restaurants: Restaurant[] = parseRestaurants(data);
