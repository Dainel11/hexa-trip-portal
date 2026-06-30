/**
 * Google Sheets data layer.
 *
 * Reads tabs from the Google Sheet via the read-only Sheets API v4 and turns
 * each tab into typed objects. Results are cached and revalidated on a timer
 * (see REVALIDATE_SECONDS), so HR/QA edits appear automatically WITHOUT any
 * redeploy. Every getter fails soft: if a tab is missing or the API errors,
 * it returns an empty array and the page shows a friendly empty state instead
 * of crashing.
 */
import { API_KEY, SPREADSHEET_ID, REVALIDATE_SECONDS, TABS } from "./config";
import { isBlockedField } from "./privacy";
import type {
  EventInfo, ItineraryItem, RoomRow, TransportRow, TshirtRow, PaymentRow,
  AllowanceRow, ContactRow, DressCodeRow, RestaurantRow, LocationRow,
  DosDontsRow, ParkingRow, RoomTypeRow, PaxRow, Row,
} from "./types";

function headerKey(h: string): string {
  return h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

/** Fetch one tab's raw grid (array of string arrays). */
async function fetchTab(tab: string): Promise<string[][]> {
  if (!SPREADSHEET_ID || !API_KEY) {
    console.warn("[sheets] Missing SPREADSHEET_ID or API_KEY — returning empty.");
    return [];
  }
  const range = encodeURIComponent(tab);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}` +
    `/values/${range}?key=${API_KEY}&majorDimension=ROWS`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS, tags: [tab] } });
    if (!res.ok) {
      console.warn(`[sheets] ${tab}: HTTP ${res.status}`);
      return [];
    }
    const json = (await res.json()) as { values?: string[][] };
    return json.values ?? [];
  } catch (err) {
    console.warn(`[sheets] ${tab}: fetch failed`, err);
    return [];
  }
}

/** Tab → array of records keyed by normalised header, with blocked fields removed. */
async function getRows(tab: string): Promise<Row[]> {
  const grid = await fetchTab(tab);
  if (grid.length < 2) return [];
  const headers = grid[0].map(headerKey);
  return grid.slice(1).flatMap((cells) => {
    const rec: Row = {};
    let hasContent = false;
    headers.forEach((h, i) => {
      if (!h || isBlockedField(h)) return;
      const v = (cells[i] ?? "").toString().trim();
      if (v) hasContent = true;
      rec[h] = v;
    });
    return hasContent ? [rec] : [];
  });
}

const pick = (r: Row, ...keys: string[]) => {
  for (const k of keys) if (r[k]) return r[k];
  return "";
};

// ── Typed getters ────────────────────────────────────────────────────────────

export async function getEventInfo(): Promise<EventInfo> {
  const grid = await fetchTab(TABS.eventInfo);
  const info: Record<string, string> = {};
  for (const row of grid.slice(1)) {
    const k = headerKey(row[0] ?? "");
    if (k && !isBlockedField(k)) info[k] = (row[1] ?? "").toString().trim();
  }
  return {
    eventName: pick(info, "event_name", "name"),
    location: pick(info, "location"),
    startDate: pick(info, "start_date", "date_start"),
    endDate: pick(info, "end_date", "date_end"),
    tagline: pick(info, "tagline"),
    heroImage: pick(info, "hero_image", "image"),
    collectionNote: pick(info, "collection_per_family", "collection_note"),
    ...info,
  };
}

export async function getSettings(): Promise<Record<string, string>> {
  const grid = await fetchTab(TABS.settings);
  const s: Record<string, string> = {};
  for (const row of grid.slice(1)) {
    const k = headerKey(row[0] ?? "");
    if (k) s[k] = (row[1] ?? "").toString().trim();
  }
  return s;
}

export async function getItinerary(): Promise<ItineraryItem[]> {
  return (await getRows(TABS.itinerary)).map((r) => ({
    date: pick(r, "date"), time: pick(r, "time"),
    activity: pick(r, "activity", "aktiviti"), venue: pick(r, "venue"),
    meal: pick(r, "meal"), dressCode: pick(r, "dress_code", "dresscode"),
    pic: pick(r, "pic", "action_person", "person_in_charge"),
  }));
}

export async function getRooms(): Promise<RoomRow[]> {
  return (await getRows(TABS.rooms)).map((r) => ({
    roomId: pick(r, "room_id", "room"), roomType: pick(r, "room_type", "type"),
    roomLeader: pick(r, "room_leader", "leader"),
    name: pick(r, "name_as_listed", "full_name", "name"),
    costType: pick(r, "cost_type"),
  }));
}

function deriveType(v: string): string {
  const u = v.toUpperCase();
  if (u.includes("BUS")) return "BUS";
  if (u.includes("VAN")) return "VAN";
  return "CAR";
}
export async function getTransport(): Promise<TransportRow[]> {
  return (await getRows(TABS.transport)).map((r) => {
    const vehicle = pick(r, "vehicle");
    const vehicleId = pick(r, "vehicle_id") || vehicle;
    const vehicleType = (pick(r, "vehicle_type") || deriveType(vehicle)).toUpperCase();
    const driverFlag = pick(r, "is_driver", "driver");
    return {
      vehicle, vehicleId, vehicleType,
      plate: pick(r, "car_plate", "plate"),
      isDriver: /^(y|yes|true|1|driver)$/i.test(driverFlag),
      pic: pick(r, "pic", "person_in_charge", "incharge"),
      name: pick(r, "name_as_listed", "full_name", "name"),
      pickupPoint: pick(r, "pickup_point", "pickup"),
      pickupTime: pick(r, "pickup_time"),
    };
  });
}

export async function getTshirts(): Promise<TshirtRow[]> {
  return (await getRows(TABS.tshirts)).map((r) => ({
    name: pick(r, "full_name", "name"),
    safariSize: pick(r, "safari_size", "size"),
    waterworldSize: pick(r, "waterworld_size"),
  }));
}

export async function getPayments(): Promise<PaymentRow[]> {
  return (await getRows(TABS.payments)).map((r) => ({
    familyGroup: pick(r, "family_group", "full_name", "name"),
    amountDue: pick(r, "amount_due_rm", "amount_due"),
    amountPaid: pick(r, "amount_paid_rm", "amount_paid"),
    balance: pick(r, "balance_rm", "balance"),
    status: pick(r, "status"),
    paxCount: pick(r, "pax_count", "pax", "no_of_pax"),
    paxAges: pick(r, "pax_ages", "ages"),
  }));
}

export async function getAllowance(): Promise<AllowanceRow[]> {
  return (await getRows(TABS.allowance)).map((r) => ({
    item: pick(r, "item"), amount: pick(r, "amount", "amount_rm"), notes: pick(r, "notes"),
  }));
}

export async function getContacts(): Promise<ContactRow[]> {
  return (await getRows(TABS.contacts)).map((r) => ({
    name: pick(r, "name"), role: pick(r, "role"), phone: pick(r, "phone", "phone_number"),
  }));
}

export async function getDressCode(): Promise<DressCodeRow[]> {
  return (await getRows(TABS.dressCode)).map((r) => ({
    day: pick(r, "day"), theme: pick(r, "theme"),
    description: pick(r, "description", "notes"), image: pick(r, "image"),
    teeColour: pick(r, "tee_colour", "tee_color", "colour", "color"),
    confirmed: pick(r, "confirmed"),
  }));
}

export async function getRestaurants(): Promise<RestaurantRow[]> {
  return (await getRows(TABS.restaurants)).map((r) => ({
    name: pick(r, "name"), cuisine: pick(r, "cuisine"), location: pick(r, "location"),
    notes: pick(r, "notes"), mapLink: pick(r, "map_link", "maps"), image: pick(r, "image"),
  }));
}

export async function getLocations(): Promise<LocationRow[]> {
  return (await getRows(TABS.locations)).map((r) => ({
    name: pick(r, "name"), address: pick(r, "address"),
    mapLink: pick(r, "map_link", "maps"), notes: pick(r, "notes"), image: pick(r, "image"),
  }));
}

export async function getDosDonts(): Promise<DosDontsRow[]> {
  return (await getRows(TABS.dosDonts)).map((r) => ({
    type: pick(r, "type"), item: pick(r, "item", "rule"), category: pick(r, "category"),
  }));
}

export async function getParking(): Promise<ParkingRow[]> {
  return (await getRows(TABS.parking)).map((r) => ({
    area: pick(r, "area"), capacity: pick(r, "capacity"),
    notes: pick(r, "notes"), mapLink: pick(r, "map_link", "maps"),
  }));
}

export async function getRoomTypes(): Promise<Record<string, string>> {
  const { ROOM_TYPE_FALLBACK } = await import("./config");
  const rows = (await getRows(TABS.roomTypes)).map((r) => ({
    code: pick(r, "code", "key"), label: pick(r, "label", "name", "value"),
  } as RoomTypeRow));
  if (!rows.length) return ROOM_TYPE_FALLBACK;
  const map: Record<string, string> = {};
  for (const r of rows) if (r.code) map[r.code.toUpperCase()] = r.label || r.code;
  return Object.keys(map).length ? map : ROOM_TYPE_FALLBACK;
}

export async function getPax(): Promise<PaxRow[]> {
  return (await getRows(TABS.pax)).map((r) => ({
    staffName: pick(r, "staff_name", "staff", "name"),
    paxName: pick(r, "pax_name", "name"),
    type: pick(r, "type", "category"),
    age: pick(r, "age"),
  }));
}

export async function getPaymentRules() {
  const { DEFAULT_RULES } = await import("./payment");
  const s = await getSettings();
  const n = (k: string, d: number) => {
    const v = Number((s[k] ?? "").replace(/[^\d.]/g, ""));
    return Number.isFinite(v) && (s[k] ?? "") !== "" ? v : d;
  };
  return {
    staff: n("pay_staff", DEFAULT_RULES.staff),
    adultGuest: [n("pay_adult_1", DEFAULT_RULES.adultGuest[0]), n("pay_adult_2plus", DEFAULT_RULES.adultGuest[1])],
    child: n("pay_child", DEFAULT_RULES.child),
    infant: n("pay_infant", DEFAULT_RULES.infant),
    infantMaxAge: n("pay_infant_max_age", DEFAULT_RULES.infantMaxAge),
    childMaxAge: n("pay_child_max_age", DEFAULT_RULES.childMaxAge),
  };
}
