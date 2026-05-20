# World Cuisine Tracker

A personal app to log every cuisine you try in London, with a scratch-map that fills in as you go.

---

## Setup (one-time, ~20 minutes)

### 1. Google Sheet

Create a new Google Sheet and set up two tabs:

**Tab 1: `restaurants`** (this is where form responses land)

The columns must match exactly:
| Cuisine | Restaurant name | Status | Date | Rating | Notes |

**Tab 2: `cuisines`** (reference list for the dropdown)

Paste all cuisine names from the app into column A — one per row. You can generate this by running `npm run dev` locally and copying the names from the list, or just paste the list from the `CUISINES` array in `src/data/cuisines.js`.

### 2. Google Form

Create a new Google Form and link responses to your Sheet's `restaurants` tab (Responses → Link to Sheets).

Add these questions in order:
1. **Cuisine** — Dropdown, populate from your `cuisines` tab range (e.g. `cuisines!A:A`)
2. **Restaurant name** — Short answer
3. **Status** — Multiple choice: `Tried` / `Want to try`
4. **Date** — Date (optional)
5. **Rating** — Linear scale 1–5, labelled "Meh" to "Essential" (optional)
6. **Notes** — Paragraph, add helper text: "Add a Google Maps link here if you have one" (optional)

Bookmark the form on your phone — that's your logging UI when you're at a restaurant.

### 3. Publish the Sheet as CSV

In your Google Sheet:
1. File → Share → Publish to web
2. Select the **`restaurants`** tab
3. Select format: **CSV**
4. Click Publish and copy the URL

Paste that URL into `src/config.js`:
```js
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/...'
```

### 4. GitHub Pages setup

1. Create a new GitHub repo (e.g. `cuisine-tracker`)
2. Update `vite.config.js` — change `/cuisine-tracker/` to your actual repo name
3. Push this code to the `main` branch
4. Go to repo Settings → Pages → Source: **GitHub Actions**
5. Push again — the Actions workflow will build and deploy automatically

Your app will be live at `https://yourusername.github.io/cuisine-tracker/`

---

## Local development

```bash
npm install
npm run dev
```

The app will show an error about the sheet URL until you configure it — that's expected.

---

## Adding new cuisines

Edit `src/data/cuisines.js` and add an entry to the `CUISINES` array. Then also add the cuisine name to your `cuisines` tab in the Google Sheet so it appears in the form dropdown.

---

## How it works

- The app fetches your published Google Sheet CSV on load
- It parses the rows with PapaParse and matches `Cuisine` values to the hardcoded cuisine list
- The world map colours in based on which cuisines have been tried or queued
- Clicking a cuisine row shows all restaurants logged for it
- Hit Refresh to pull the latest entries from the sheet (Google caches the CSV for ~1–2 minutes after editing)
