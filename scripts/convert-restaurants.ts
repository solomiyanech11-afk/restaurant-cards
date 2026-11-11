// Reads every field of data/restaurants.xlsx, checks each row,
// and writes the result to src/data/restaurants.json.
// Run with: npm run data
// Stops with an error if a row is missing a field or has a wrong value.

import ExcelJS from "exceljs";
import { mkdir, writeFile } from "node:fs/promises";
import { parseRestaurant, RESTAURANT_FIELDS } from "../src/lib/parseRestaurants.ts";
import type { Restaurant } from "../src/types/restaurant.ts";

const INPUT = "data/restaurants.xlsx";
const OUTPUT = "src/data/restaurants.json";

async function main(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error(`${INPUT} has no sheets`);

  // Header row: find which column holds each field.
  const position = new Map<string, number>();
  sheet.getRow(1).eachCell((cell, col) => {
    position.set(String(cell.value).trim(), col);
  });
  for (const field of RESTAURANT_FIELDS) {
    if (!position.has(field)) throw new Error(`Missing column "${field}" in ${INPUT}`);
  }

  const restaurants: Restaurant[] = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    if (!row.hasValues) continue;
    const raw: Record<string, unknown> = {};
    for (const field of RESTAURANT_FIELDS) {
      raw[field] = row.getCell(position.get(field) ?? 0).value;
    }
    restaurants.push(parseRestaurant(raw, `Sheet row ${r}`));
  }

  const ids = new Set(restaurants.map((x) => x.id));
  if (ids.size !== restaurants.length) throw new Error("Duplicate id found");

  await mkdir("src/data", { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(restaurants, null, 2) + "\n");
  console.log(`Wrote ${restaurants.length} restaurants to ${OUTPUT}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
