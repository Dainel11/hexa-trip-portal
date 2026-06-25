/**
 * Central configuration. Everything here is driven by environment variables so
 * HR/QA never need to touch code. To change WHAT data is shown, edit the Google
 * Sheet. To change HOW OFTEN it refreshes or whether payments show, edit the
 * environment variables in Vercel.
 */

export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "";
export const API_KEY = process.env.GOOGLE_SHEETS_API_KEY ?? "";
export const REVALIDATE_SECONDS = Number(process.env.REVALIDATE_SECONDS ?? 60);
export const SHOW_PAYMENTS =
  (process.env.NEXT_PUBLIC_SHOW_PAYMENTS ?? "true").toLowerCase() !== "false";
export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? "Company Trip Portal";

/**
 * Tab names exactly as they appear at the bottom of the Google Sheet.
 * If HR renames a tab in the sheet, update the matching value here (the only
 * code change content edits could ever require — renaming a whole tab).
 */
export const TABS = {
  eventInfo: "EventInfo",
  itinerary: "Itinerary",
  rooms: "Rooms",
  transport: "Transport",
  tshirts: "TShirts",
  payments: "Payments",
  allowance: "Allowance",
  contacts: "Contacts",
  dressCode: "DressCode",
  restaurants: "Restaurants",
  locations: "Locations",
  dosDonts: "DosDonts",
  parking: "Parking",
  settings: "Settings",
} as const;

/** Navigation shown in the sticky header, in order. */
export const NAV = [
  { href: "/", label: "Overview", code: "00" },
  { href: "/itinerary", label: "Itinerary", code: "01" },
  { href: "/rooms", label: "Rooms", code: "02" },
  { href: "/transport", label: "Transport", code: "03" },
  { href: "/tshirt", label: "T-Shirt", code: "04" },
  { href: "/payment", label: "Payment", code: "05" },
  { href: "/allowance", label: "Allowance", code: "06" },
  { href: "/contacts", label: "Contacts", code: "07" },
  { href: "/dress-code", label: "Dress Code", code: "08" },
  { href: "/restaurants", label: "Restaurants", code: "09" },
  { href: "/locations", label: "Locations", code: "10" },
  { href: "/dos-donts", label: "Do's & Don'ts", code: "11" },
  { href: "/parking", label: "Parking", code: "12" },
] as const;
