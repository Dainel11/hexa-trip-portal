export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "";
export const API_KEY = process.env.GOOGLE_SHEETS_API_KEY ?? "";
export const REVALIDATE_SECONDS = Number(process.env.REVALIDATE_SECONDS ?? 60);
export const SHOW_PAYMENTS = (process.env.NEXT_PUBLIC_SHOW_PAYMENTS ?? "true").toLowerCase() !== "false";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Company Trip Portal";

export const TABS = {
  // ROSTER_SYSTEM (normalised) — one person lives in one place.
  employees: "Employees",   // main source of truth (1 row = 1 employee)
  family: "Family",         // 1-to-many via emp_id
  vehicles: "Vehicles",     // lookup by vehicle_id
  roomTypes: "RoomTypes",   // FS → Family Studio, 3R → 3 Bedroom Condo
  sizes: "Sizes",           // valid shirt sizes (incl. kids 22–34)
  employeeLocations: "Locations", // HQ / PANDAMARAN (pickup) — NOT venues
  config: "Config",         // all system settings (key | value)
  // Content tabs (HR-editable, no people duplicated)
  itinerary: "Itinerary", dressCode: "DressCode", places: "Places",
  contacts: "Contacts", dosDonts: "DosDonts",
} as const;

/** Full navigation (Allowance + Contacts removed — info lives on Home/Transport). */
export const NAV = [
  { href: "/", label: "Overview", code: "00" },
  { href: "/itinerary", label: "Itinerary", code: "01" },
  { href: "/rooms", label: "Rooms", code: "02" },
  { href: "/transport", label: "Transport", code: "03" },
  { href: "/shirts", label: "Shirts & Dress Code", code: "04" },
  { href: "/locations", label: "Locations", code: "05" },
  { href: "/payment", label: "Payment", code: "06" },
  { href: "/dos-donts", label: "Do's & Don'ts", code: "07" },
] as const;

export const BOTTOM_NAV = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/itinerary", label: "Itinerary", icon: "calendar" },
  { href: "/transport", label: "Transport", icon: "bus" },
  { href: "/shirts", label: "Shirts", icon: "shirt" },
  { href: "/locations", label: "Places", icon: "pin" },
] as const;

/* ─── Config defaults (overridable from the Settings tab) ─── */
export const ROOM_TYPE_FALLBACK: Record<string, string> = { FS: "Family Studio", "3R": "3 Bedroom Condo" };
export const MEAL_ALLOWANCE_DEFAULT = 80;
export const DRIVER_ALLOWANCE_DEFAULT = 130;
export const DRIVER_MIN_PAX_DEFAULT = 3;

/** Read a numeric setting with a fallback. */
export function numSetting(settings: Record<string, string>, key: string, fallback: number): number {
  const n = Number((settings[key] ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
/** Map a room code/label to its full label via config (accepts code OR full text). */
export function roomLabel(value: string, roomId: string, map: Record<string, string>): string {
  const v = (value || "").trim();
  if (map[v.toUpperCase()]) return map[v.toUpperCase()];          // value is a code
  if (Object.values(map).some((l) => l.toLowerCase() === v.toLowerCase())) return v; // already full label
  const code = (roomId || "").trim().split(/\s+/)[0]?.toUpperCase() || "";           // derive from roomId prefix
  if (map[code]) return map[code];
  return v;
}
