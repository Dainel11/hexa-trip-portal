export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "";
export const API_KEY = process.env.GOOGLE_SHEETS_API_KEY ?? "";
export const REVALIDATE_SECONDS = Number(process.env.REVALIDATE_SECONDS ?? 60);
export const SHOW_PAYMENTS = (process.env.NEXT_PUBLIC_SHOW_PAYMENTS ?? "true").toLowerCase() !== "false";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Company Trip Portal";

export const TABS = {
  eventInfo: "EventInfo", itinerary: "Itinerary", rooms: "Rooms", transport: "Transport",
  tshirts: "TShirts", payments: "Payments", allowance: "Allowance", contacts: "Contacts",
  dressCode: "DressCode", restaurants: "Restaurants", locations: "Locations",
  dosDonts: "DosDonts", parking: "Parking", settings: "Settings",
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
