# Restaurant cards

All 40 restaurants from `data/restaurants.xlsx`, shown as cards that match the Figma wireframe. Built with Next.js and TypeScript. This is the typed data layer that the stackable filter panel builds on next.

![All 40 restaurant cards](screenshot.png)

[Full-size screenshot of all 40 cards](screenshot.png)

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Where the data comes from

- `data/restaurants.xlsx` is the only source of truth. It is committed as is, and no data is typed by hand.
- `npm run data` runs `scripts/convert-restaurants.ts`. The script reads every field of every row, checks it, and writes `src/data/restaurants.ts`. It stops with an error if a field is missing or has a wrong value (for example, a `price_tier` outside 1–4).
- Note: the sheet stores every cell as text (`"28"`, `"4.6"`, `"true"`). The script converts these to real numbers and booleans, so filters compare numbers, not strings.

## Types (`src/types`)

- `Restaurant`: the 9 fields of the sheet, with the same names (`delivery_time_min`, `price_tier`, `is_vegan`, ...).
- `PriceBand`: only `"$" | "$$" | "$$$" | "$$$$"`, never a plain string. `toPriceBand()` turns `price_tier` 1–4 into a band.
- `FilterState`: one field per chip group, each with a typed "nothing selected":
  - `delivery: 15 | 30 | 45 | null`
  - `price: PriceBand[]` (`[]` = nothing selected)
  - `dietary: ("vegetarian" | "vegan" | "gluten_free")[]` (`[]` = nothing selected)
  - `rating: 3.5 | 4.0 | 4.5 | null`
- `EMPTY_FILTERS`: the state with nothing selected in every group.

## Checks

```bash
npm run check    # TypeScript strict mode + ESLint
```

TypeScript `strict` is on, and ESLint's `@typescript-eslint/no-explicit-any` is set to `error`, so `any` cannot appear in the code.
