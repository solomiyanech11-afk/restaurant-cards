# Expected-Results Check Table: Restaurant Filters

**Source:** Uber Eats Game-Day Restaurant Set (40 listings)

**Edge rule: exactly 30 minutes COUNTS.** The 30 min chip keeps every restaurant with `delivery_time_min <= 30`, so a 30-minute restaurant passes. Every row below applies this rule. Rating works the same way: the 4.0+ chip keeps `rating >= 4.0`, so exactly 4.0 passes.

**Combine rules (from the wireframe notes):**
- **Price:** OR. A restaurant passes if its `price_tier` matches at least one selected chip.
- **Dietary:** AND. Every selected tag must be `true`.
- **Delivery time / Rating:** one chip at a time, read as "at most" / "at least".
- **Between groups:** AND. A restaurant must pass all four groups. A group with no chip selected lets everything through.

| # | Active filters | Restaurants that remain | Count | Borderline restaurant |
|---|---|---|---|---|
| 1 | Vegetarian + 30 min + $ or $$ | Bombay Spice House, Slice & Fire Pizza, Green Bowl Kitchen, Casa Oaxaca Taqueria, Olive & Ember Mezze, Leafline Salad Co., Mumbai Express Kitchen, Via Roma Pasta Bar, Barrio Bowls | 9 | **Olive & Ember Mezze** has exactly 30 min delivery. It stays because exactly 30 counts. If 30 were excluded, the count would be 8. |
| 2 | 30 min + $ or $$ + Vegetarian AND Vegan + 4.0+ (all four groups) | Bombay Spice House, Green Bowl Kitchen, Olive & Ember Mezze, Barrio Bowls | 4 | **Mumbai Express Kitchen** (17 min, $, vegetarian and vegan) passes three groups but is rated 3.9, so 4.0+ drops it. On the other side, Olive & Ember Mezze sits on both edges (exactly 30 min, exactly 4.0) and stays. |
| 3 | Vegan AND Gluten-free + $ | *(none)* | 0 | **Leafline Salad Co.** is $ and gluten-free but not vegan. **Mumbai Express Kitchen** is $ and vegan but not gluten-free. Each one has one of the two tags, but dietary is AND, so neither passes. |
| 4 | Vegetarian + 30 min (row 1 without the price filter) | Bombay Spice House, Slice & Fire Pizza, Green Bowl Kitchen, Casa Oaxaca Taqueria, Olive & Ember Mezze, Rooted Plant Kitchen, Leafline Salad Co., Pad Thai Republic, Mumbai Express Kitchen, Via Roma Pasta Bar, Barrio Bowls | 11 | **Rooted Plant Kitchen** (21 min, vegetarian, $$$) comes back once price is removed. It was excluded in row 1 only because $$$ isn't $ or $$. Pad Thai Republic ($$$, 23 min) returns for the same reason. All 9 restaurants from row 1 are still here. |

**Data note for testing:** Sprout & Seed, Chiang Mai Noodle Bar and Tofu Temple have `is_vegan = true` but `is_vegetarian = false`. The filter must read each tag as written and must not assume vegan means vegetarian. None of the three is in a Vegetarian row above.
