import Papa from 'papaparse'
import { SHEET_CSV_URL } from '../config'
import { CUISINES } from '../data/cuisines'

// Build a lookup from display name → id so we can match form entries
// e.g. "Sichuan" → "china-sichuan"
const NAME_TO_ID = Object.fromEntries(CUISINES.map(c => [c.name.toLowerCase(), c.id]))

function resolveCuisineId(name) {
  return NAME_TO_ID[name.trim().toLowerCase()] ?? name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
}

export async function fetchRestaurants() {
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const rows = data.map((row, i) => ({
          id: String(i),
          cuisineId: resolveCuisineId(row['Cuisine'] ?? ''),
          cuisineName: (row['Cuisine'] ?? '').trim(),
          name: (row['Restaurant name'] ?? '').trim(),
          status: (row['Status'] ?? '').trim(),           // "Tried" | "Want to try"
          date: (row['Date'] ?? '').trim() || null,
          rating: row['Rating'] ? parseInt(row['Rating'], 10) : null,
          notes: (row['Notes'] ?? '').trim() || null,
        })).filter(r => r.name && r.status)
        resolve(rows)
      },
      error: reject,
    })
  })
}
