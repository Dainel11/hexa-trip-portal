/**
 * Google Sheets data layer — ROSTER_SYSTEM (normalised).
 *
 * Source of truth is the Employees tab (1 row = 1 employee). Family members
 * live in the Family tab and are joined to their employee via emp_id (they
 * INHERIT room + vehicle — never retyped). Vehicles and Config are lookups.
 *
 * The page-facing getters (getRooms/getTransport/getTshirts/getPax/…) keep the
 * SAME names and return shapes as before, so no page/component needs to change:
 * the old wide-format tabs are simply no longer read. Every getter fails soft.
 *
 * Rules enforced here:
 *  • Only employees with status = TRUE are included (blank = included; FALSE = excluded).
 *  • Family of an inactive employee is auto-excluded (join drops them).
 *  • Rooms / transport / shirts / pax are all DERIVED — no manual counts.
 */
import { API_KEY, SPREADSHEET_ID, REVALIDATE_SECONDS, TABS } from "./config";
import { isBlockedField } from "./privacy";
import type {
  EventInfo, ItineraryItem, RoomRow, TransportRow, TshirtRow, PaymentRow,
  AllowanceRow, ContactRow, DressCodeRow, RestaurantRow, LocationRow,
  DosDontsRow, ParkingRow, PaxRow, Row, EmployeeRow, FamilyRow, VehicleRow, DirectoryEntry,
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
    if (!res.ok) { console.warn(`[sheets] ${tab}: HTTP ${res.status}`); return []; }
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
const yes = (v: string) => /^(y|yes|true|1|driver|checked)$/i.test((v || "").trim());
/** Checkbox: TRUE/blank = active; FALSE/no/0 = cancelled. */
const isActive = (v: string) => {
  const t = (v || "").trim().toLowerCase();
  return t === "" ? true : /^(true|yes|1|checked|ya|x|✓)$/.test(t);
};
function deriveType(v: string): string {
  const u = (v || "").toUpperCase();
  if (u.includes("BUS")) return "BUS";
  if (u.includes("VAN")) return "VAN";
  return "CAR";
}

// ── Normalised source getters ────────────────────────────────────────────────

export async function getEmployees(): Promise<EmployeeRow[]> {
  return (await getRows(TABS.employees)).map((r) => ({
    empId: pick(r, "emp_id", "id"),
    name: pick(r, "name", "full_name", "employee_name"),
    phone: pick(r, "phone", "phone_number"),
    location: pick(r, "location"),
    vegetarian: pick(r, "vegetarian"),
    isManagement: yes(pick(r, "is_management", "management")),
    tshirtSize: pick(r, "tshirt_size", "size", "shirt_size"),
    roomId: pick(r, "room_id", "room"),
    vehicleId: pick(r, "vehicle_id", "vehicle"),
    isDriver: yes(pick(r, "is_driver", "driver")),
    carPlate: pick(r, "car_plate", "plate"),
    emergencyName: pick(r, "emergency_name"),
    emergencyPhone: pick(r, "emergency_phone"),
    relationship: pick(r, "relationship", "relation"),
    notes: pick(r, "notes"),
    isLeader: yes(pick(r, "is_leader", "leader", "room_leader")),
    active: isActive(pick(r, "status", "active", "joining")),
  })).filter((e) => e.name);
}

export async function getFamily(): Promise<FamilyRow[]> {
  return (await getRows(TABS.family)).map((r) => ({
    memberId: pick(r, "member_id", "id"),
    empId: pick(r, "emp_id", "employee_id"),
    name: pick(r, "name", "full_name", "member_name"),
    age: pick(r, "age"),
    tshirtSize: pick(r, "tshirt_size", "size"),
    vegetarian: pick(r, "vegetarian"),
    relationship: pick(r, "relationship", "relation"),
  })).filter((f) => f.name && f.empId);
}

export async function getVehicles(): Promise<VehicleRow[]> {
  return (await getRows(TABS.vehicles)).map((r) => ({
    vehicleId: pick(r, "vehicle_id", "id", "vehicle"),
    type: pick(r, "type", "vehicle_type"),
    plate: pick(r, "plate", "car_plate"),
    driverOrPic: pick(r, "driver_or_pic", "driver", "pic", "person_in_charge"),
  })).filter((v) => v.vehicleId);
}

export async function getConfig(): Promise<Record<string, string>> {
  const grid = await fetchTab(TABS.config);
  const c: Record<string, string> = {};
  for (const row of grid.slice(1)) {
    const k = headerKey(row[0] ?? "");
    if (k && !isBlockedField(k)) c[k] = (row[1] ?? "").toString().trim();
  }
  return c;
}

/** Active employees + a fast emp_id → employee lookup (for inheritance). */
async function activeRoster() {
  const [emps, fam] = await Promise.all([getEmployees(), getFamily()]);
  const active = emps.filter((e) => e.active);
  const byId = new Map(active.map((e) => [e.empId, e]));
  return { active, fam, byId };
}

// ── Backward-compatible page getters (same names + shapes as before) ─────────

export async function getEventInfo(): Promise<EventInfo> {
  const cfg = await getConfig();
  return {
    eventName: pick(cfg, "event_name", "name"),
    location: pick(cfg, "location"),
    startDate: pick(cfg, "start_date", "date_start"),
    endDate: pick(cfg, "end_date", "date_end"),
    tagline: pick(cfg, "tagline"),
    heroImage: pick(cfg, "hero_image", "image"),
    collectionNote: pick(cfg, "collection_per_family", "collection_note"),
    ...cfg,
  };
}

/** Settings = the Config key/value map (meal allowance, driver rules, pay_* …). */
export async function getSettings(): Promise<Record<string, string>> {
  return getConfig();
}

export async function getItinerary(): Promise<ItineraryItem[]> {
  return (await getRows(TABS.itinerary)).map((r) => ({
    date: pick(r, "date"), time: pick(r, "time"),
    activity: pick(r, "activity", "aktiviti"), venue: pick(r, "venue"),
    meal: pick(r, "meal"), dressCode: pick(r, "dress_code", "dresscode"),
    pic: pick(r, "pic", "action_person", "person_in_charge"),
  }));
}

/** Rooms derived: each active employee + their family, grouped by room_id. */
export async function getRooms(): Promise<RoomRow[]> {
  const { active, fam, byId } = await activeRoster();
  // Designate one leader per room: the employee flagged is_leader, else the first employee.
  const empsByRoom = new Map<string, EmployeeRow[]>();
  for (const e of active) if (e.roomId) {
    const list = empsByRoom.get(e.roomId) ?? [];
    list.push(e); empsByRoom.set(e.roomId, list);
  }
  const leaderOf = new Map<string, string>();
  for (const [rid, list] of empsByRoom) leaderOf.set(rid, (list.find((e) => e.isLeader) ?? list[0])?.name ?? "");
  const out: RoomRow[] = [];
  for (const e of active)
    if (e.roomId) out.push({ roomId: e.roomId, roomType: "", roomLeader: leaderOf.get(e.roomId) || "", name: e.name, costType: "" });
  for (const f of fam) {
    const e = byId.get(f.empId);
    if (e?.roomId) out.push({ roomId: e.roomId, roomType: "", roomLeader: leaderOf.get(e.roomId) || "", name: f.name, costType: "" });
  }
  return out;
}

/** Transport derived from Vehicles + Employees + Family (passengers inherit vehicle). */
export async function getTransport(): Promise<TransportRow[]> {
  const [{ active, fam, byId }, vehicles] = await Promise.all([activeRoster(), getVehicles()]);
  const vById = new Map(vehicles.map((v) => [v.vehicleId.toUpperCase(), v]));
  const rowFor = (name: string, e: EmployeeRow, driver: boolean): TransportRow | null => {
    const vid = e.vehicleId;
    if (!vid) return null;
    const v = vById.get(vid.toUpperCase());
    const vehicleType = (v?.type || deriveType(vid)).toUpperCase();
    const isCar = vehicleType === "CAR";
    const pic = !isCar && v && !/^\(/.test(v.driverOrPic) ? v.driverOrPic : "";
    // Cars: the group title IS the plate (vehicle_id), so no separate plate badge needed.
    return { vehicle: vid, vehicleId: vid, vehicleType, plate: "", isDriver: driver, pic, name, pickupPoint: "", pickupTime: "" };
  };
  const out: TransportRow[] = [];
  for (const e of active) { const r = rowFor(e.name, e, e.isDriver); if (r) out.push(r); }
  for (const f of fam) { const e = byId.get(f.empId); if (e) { const r = rowFor(f.name, e, false); if (r) out.push(r); } }
  return out;
}

/** Shirts derived: one registered size per person, shown for both shirt days. */
export async function getTshirts(): Promise<TshirtRow[]> {
  const { active, fam, byId } = await activeRoster();
  const out: TshirtRow[] = [];
  for (const e of active)
    out.push({ name: e.name, staff: e.name, relationship: "", size: e.tshirtSize, safariSize: e.tshirtSize, waterworldSize: e.tshirtSize });
  for (const f of fam) {
    const e = byId.get(f.empId);
    if (e) out.push({ name: f.name, staff: e.name, relationship: f.relationship || "", size: f.tshirtSize, safariSize: f.tshirtSize, waterworldSize: f.tshirtSize });
  }
  return out;
}

/** Pax derived for the payment engine: one staff row per employee + their family. */
export async function getPax(): Promise<PaxRow[]> {
  const { active, fam, byId } = await activeRoster();
  const out: PaxRow[] = [];
  for (const e of active) out.push({ staffName: e.name, paxName: e.name, type: "staff", age: "" });
  for (const f of fam) { const e = byId.get(f.empId); if (e) out.push({ staffName: e.name, paxName: f.name, type: "", age: f.age }); }
  return out;
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

// Places tab carries locations + restaurants + parking, split by `category`.
async function places() { return getRows(TABS.places); }
const catIs = (r: Row, ...w: string[]) => w.some((x) => pick(r, "category").toLowerCase().includes(x));

export async function getLocations(): Promise<LocationRow[]> {
  return (await places()).filter((r) => catIs(r, "location", "place", "venue")).map((r) => ({
    name: pick(r, "name"), address: pick(r, "address_or_location", "address", "location"),
    mapLink: pick(r, "map_link", "maps"), notes: pick(r, "notes"), image: pick(r, "image"),
  }));
}

export async function getRestaurants(): Promise<RestaurantRow[]> {
  return (await places()).filter((r) => catIs(r, "restaurant", "food", "eat", "makan")).map((r) => ({
    name: pick(r, "name"), cuisine: pick(r, "cuisine"),
    location: pick(r, "address_or_location", "location", "address"),
    notes: pick(r, "notes"), mapLink: pick(r, "map_link", "maps"), image: pick(r, "image"),
  }));
}

export async function getParking(): Promise<ParkingRow[]> {
  return (await places()).filter((r) => catIs(r, "parking", "park")).map((r) => ({
    area: pick(r, "name", "area"), capacity: pick(r, "address_or_location", "capacity"),
    notes: pick(r, "notes"), mapLink: pick(r, "map_link", "maps"),
  }));
}

export async function getDosDonts(): Promise<DosDontsRow[]> {
  return (await getRows(TABS.dosDonts)).map((r) => ({
    type: pick(r, "type"), item: pick(r, "item", "rule"), category: pick(r, "category"),
  }));
}

export async function getRoomTypes(): Promise<Record<string, string>> {
  const { ROOM_TYPE_FALLBACK } = await import("./config");
  const rows = (await getRows(TABS.roomTypes)).map((r) => ({
    code: pick(r, "code", "key"), label: pick(r, "label", "name", "value"),
  }));
  const map: Record<string, string> = {};
  for (const r of rows) if (r.code) map[r.code.toUpperCase()] = r.label || r.code;
  return Object.keys(map).length ? map : ROOM_TYPE_FALLBACK;
}

/**
 * Driver (car) allowance eligibility — rule [C]:
 *  A car driver qualifies if they bring their own official family member,
 *  OR the car carries at least `minPax` people total (including the driver).
 * Returns vehicle_id → { eligible, driver, occupants }.
 */
export async function getCarAllowances(minPax: number): Promise<Map<string, { eligible: boolean; driver: string; occupants: number }>> {
  const [{ active, fam, byId }, vehicles] = await Promise.all([activeRoster(), getVehicles()]);
  const vType = new Map(vehicles.map((v) => [v.vehicleId.toUpperCase(), (v.type || "").toUpperCase()]));
  const famByEmp = new Map<string, number>();
  for (const f of fam) if (byId.get(f.empId)) famByEmp.set(f.empId, (famByEmp.get(f.empId) || 0) + 1);
  const occ = new Map<string, number>();
  const driverOf = new Map<string, { name: string; empId: string }>();
  for (const e of active) if (e.vehicleId) {
    occ.set(e.vehicleId, (occ.get(e.vehicleId) || 0) + 1);
    if (e.isDriver) driverOf.set(e.vehicleId, { name: e.name, empId: e.empId });
  }
  for (const f of fam) { const e = byId.get(f.empId); if (e?.vehicleId) occ.set(e.vehicleId, (occ.get(e.vehicleId) || 0) + 1); }
  const out = new Map<string, { eligible: boolean; driver: string; occupants: number }>();
  for (const [vid, count] of occ) {
    const type = vType.get(vid.toUpperCase()) || deriveType(vid);
    const drv = driverOf.get(vid);
    if (type !== "CAR" || !drv) { out.set(vid, { eligible: false, driver: drv?.name || "", occupants: count }); continue; }
    const broughtFamily = (famByEmp.get(drv.empId) || 0) > 0;
    out.set(vid, { eligible: broughtFamily || count >= minPax, driver: drv.name, occupants: count });
  }
  return out;
}

/** Flat searchable directory for the homepage global search (one record per active employee). */
export async function getDirectory(): Promise<DirectoryEntry[]> {
  const [{ active, fam, byId }, vehicles, roomTypes] = await Promise.all([activeRoster(), getVehicles(), getRoomTypes()]);
  const vMap = new Map(vehicles.map((v) => [v.vehicleId.toUpperCase(), v]));
  const empsByRoom = new Map<string, EmployeeRow[]>();
  for (const e of active) if (e.roomId) { const l = empsByRoom.get(e.roomId) ?? []; l.push(e); empsByRoom.set(e.roomId, l); }
  const leaderOf = new Map<string, string>();
  for (const [rid, list] of empsByRoom) leaderOf.set(rid, (list.find((e) => e.isLeader) ?? list[0])?.name ?? "");
  const famByEmp = new Map<string, FamilyRow[]>();
  for (const f of fam) if (byId.get(f.empId)) { const l = famByEmp.get(f.empId) ?? []; l.push(f); famByEmp.set(f.empId, l); }
  const labelOf = (rid: string) => roomTypes[(rid.split(/[\s-]/)[0] || "").toUpperCase()] || "";
  return active.map((e) => {
    const v = e.vehicleId ? vMap.get(e.vehicleId.toUpperCase()) : undefined;
    const type = (v?.type || (e.vehicleId ? deriveType(e.vehicleId) : "")).toUpperCase();
    const family = (famByEmp.get(e.empId) || []).map((f) => ({ name: f.name, relationship: f.relationship || "", size: f.tshirtSize || "" }));
    return {
      name: e.name, empId: e.empId,
      roomId: e.roomId, roomLabel: labelOf(e.roomId),
      roomLeader: leaderOf.get(e.roomId) || "", isLeader: (leaderOf.get(e.roomId) || "") === e.name,
      vehicleId: e.vehicleId, vehicleType: type,
      plate: e.vehicleId && type === "CAR" ? (v?.plate || e.vehicleId) : "",
      isDriver: e.isDriver, size: e.tshirtSize || "",
      family, aliases: family.map((f) => f.name),
    };
  });
}

// Legacy tabs no longer exist in ROSTER_SYSTEM — return empty (nothing reads them).
export async function getPayments(): Promise<PaymentRow[]> { return []; }
export async function getAllowance(): Promise<AllowanceRow[]> { return []; }

export async function getPaymentRules() {
  const { DEFAULT_RULES } = await import("./payment");
  const s = await getConfig();
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
