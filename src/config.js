// ─────────────────────────────────────────────────────────
//  CONFIGURATION  —  edit this file after setting up Sheets
// ─────────────────────────────────────────────────────────
//
//  How to get your CSV URL:
//  1. Open your Google Sheet
//  2. File → Share → Publish to web
//  3. Select the "restaurants" tab, format = CSV, click Publish
//  4. Copy the URL and paste it below
//
export const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS56Wwjwg5bI8lnTPaJ5m6qAt1SGMqDoqkY3tFR2l1cphL_fXQ6yPkThmHYNu3rjHlYbsdUruicyc6H/pub?gid=0&single=true&output=csv'

// Expected column headers in your Google Form / Sheet:
//   Cuisine            ← dropdown value (must match cuisine name exactly)
//   Restaurant name    ← text
//   Status             ← "Tried" or "Want to try"
//   Date               ← date picker (optional)
//   Rating             ← number 1–5 (optional)
//   Notes              ← paragraph, Google Maps link welcome (optional)
