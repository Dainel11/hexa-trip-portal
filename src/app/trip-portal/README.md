# Hexa Company Trip Portal

A mobile-first, QR-friendly trip portal built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS**, using **Google Sheets as a no-code CMS**. HR and QA update everything from the spreadsheet — **no code changes and no redeployment** are needed for content edits.

---

## 1. Folder structure

```
trip-portal/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # Shell: fonts, theme, sticky nav, footer
│  │  ├─ globals.css           # Design system + dark mode + print styles
│  │  ├─ page.tsx              # Event Overview (home)
│  │  ├─ itinerary/page.tsx    # Itinerary (+ print)
│  │  ├─ rooms/page.tsx        # Room list + room leader (searchable)
│  │  ├─ transport/page.tsx    # Transport list (searchable)
│  │  ├─ tshirt/page.tsx       # T-shirt sizes (searchable)
│  │  ├─ payment/page.tsx      # Family payment (privacy-gated)
│  │  ├─ allowance/page.tsx    # Staff allowance
│  │  ├─ contacts/page.tsx     # Contact persons (tap to call)
│  │  ├─ dress-code/page.tsx   # Dress code
│  │  ├─ restaurants/page.tsx  # Restaurant choices
│  │  ├─ locations/page.tsx    # Locations (maps links)
│  │  ├─ dos-donts/page.tsx    # Do's & Don'ts
│  │  ├─ parking/page.tsx      # Parking information
│  │  ├─ not-found.tsx         # 404
│  │  └─ api/revalidate/route.ts  # Optional "publish now" endpoint
│  ├─ components/              # Nav, ThemeToggle, SearchableList, Card, etc.
│  └─ lib/
│     ├─ config.ts             # Env-driven settings + tab names + nav
│     ├─ sheets.ts             # Google Sheets fetch + parse (fail-soft)
│     ├─ types.ts              # TypeScript row types
│     ├─ privacy.ts            # IC masking / blocked-field guard
│     └─ format.ts             # RM currency, tel:, groupBy helpers
├─ google-sheets-template/     # CSVs to import as new content tabs
├─ public/logo.svg             # Placeholder — replace with the Hexa logo
├─ .env.local.example          # Copy to .env.local and fill in
├─ tailwind.config.ts
├─ next.config.ts
└─ package.json
```

---

## 2. Google Sheets setup (one-time)

The portal reads the **structured workbook** (the one with the clean `Roster / Rooms / Transport / TShirts / Payments` tabs) **plus** these content tabs.

### Step A — Add the content tabs
In `google-sheets-template/` there is one CSV per new tab. For each file:
1. In Google Sheets: **+** (new tab) and name it **exactly** as the file (e.g. `DressCode`, `Restaurants`, `Locations`, `DosDonts`, `Parking`, `Contacts`, `Allowance`, `EventInfo`, `Settings`).
2. **File → Import → Upload** the CSV → **Insert new sheet** (or paste the rows). Row 1 must stay as the header row.
3. For **Room Leader**: add a `room_leader` column to the existing **Rooms** tab and type the leader's name on each room's first row.

### Step B — Get an API key
1. Go to **https://console.cloud.google.com** → create/select a project.
2. **APIs & Services → Library →** enable **Google Sheets API**.
3. **APIs & Services → Credentials → Create credentials → API key**.
4. Click the key → **API restrictions → Restrict key → Google Sheets API** only. Save.

### Step C — Share the sheet
Open the sheet → **Share → General access → "Anyone with the link" → Viewer.**
(The portal hides ICs and only shows phone numbers for contacts, so no identity numbers are exposed. Keep payments off via the env flag if you prefer — see below.)

> Tab names are the only thing the code "knows". Adding/editing **rows or columns** never needs a code change. Renaming a whole **tab** means updating the matching name in `src/lib/config.ts → TABS`.

---

## 3. Environment variables

Copy `.env.local.example` → `.env.local` for local dev, and add the same keys in Vercel.

| Variable | Required | Purpose |
|---|---|---|
| `GOOGLE_SHEETS_SPREADSHEET_ID` | ✅ | The ID from the sheet URL. |
| `GOOGLE_SHEETS_API_KEY` | ✅ | Read-only Sheets API key from step B. |
| `REVALIDATE_SECONDS` | – | How often the portal re-reads the sheet (default 60). |
| `REVALIDATE_SECRET` | – | Enables the instant "publish now" endpoint. |
| `NEXT_PUBLIC_SHOW_PAYMENTS` | – | `false` hides the Family Payment page entirely. |
| `NEXT_PUBLIC_SITE_NAME` | – | Header / browser-tab title. |

---

## 4. Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the two Google values
npm run dev                        # http://localhost:3000
```

---

## 5. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to **https://vercel.com → Add New → Project →** import the repo.
3. Framework preset auto-detects **Next.js**. Leave build settings default.
4. **Settings → Environment Variables:** add the variables from section 3.
5. **Deploy.** You'll get a `https://your-trip.vercel.app` URL.
6. Generate a **QR code** pointing at that URL (e.g. qr-code-generator.com) and print it for noticeboards / the bus.

To deploy updates to the **code** later: push to GitHub → Vercel redeploys automatically.
To update **content**: just edit the Google Sheet (see below) — no redeploy.

---

## 6. Maintenance guide for HR & QA

**Golden rule:** to change what people see, **edit the Google Sheet**. The website updates itself within ~1 minute. You never touch code and never redeploy.

**Everyday edits**
- *Move someone to another room/bus* → change their row in the `Rooms` / `Transport` tab.
- *Fix a t-shirt size* → edit the `TShirts` tab.
- *Update the schedule* → edit the `Itinerary` tab.
- *Change a contact number* → edit the `Contacts` tab.
- *Add a restaurant / location / rule / parking note* → add a row to that tab.
- *Add an image* → paste a public image URL into the `image` column.

**Want a change to appear instantly** (instead of waiting ~1 min)?
Visit: `https://your-trip.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/rooms`
(swap `/rooms` for the page you edited, or `/` for the home page).

**Rules that keep the portal correct**
- Never delete or rename **row 1** (the headers) of any tab.
- Never rename a **tab** unless you also tell the developer (it's the one code link).
- Keep the IC columns in the sheet for your own records — the portal **never displays them**.
- Use the `Settings` tab to set a `logo_url` (the Hexa logo) and event hashtag.

**Turning the payment page off**
In Vercel → Environment Variables, set `NEXT_PUBLIC_SHOW_PAYMENTS=false` and redeploy. The page becomes a private-notice placeholder.

**Privacy note (PDPA):** the sheet is shared view-only and the portal masks/omits IC numbers, but the link is still guessable. Don't publish raw ICs or bank details in any tab the portal reads, and share the QR/URL internally rather than publicly.
