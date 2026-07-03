import type { PaxRow } from "./types";

export interface PaymentRules {
  staff: number;
  adultGuest: number[];   // [1st, 2nd, ...] last value repeats for extra guests
  child: number;
  infant: number;
  infantMaxAge: number;   // age < this  => infant (RM0)
  childMaxAge: number;    // age <= this => child
}

export const DEFAULT_RULES: PaymentRules = {
  staff: 0, adultGuest: [375, 750], child: 375, infant: 0, infantMaxAge: 4, childMaxAge: 11,
};

export type PaxType = "staff" | "guest" | "child" | "infant";

export function classify(type: string, age: number | null, rules: PaymentRules): PaxType {
  const t = (type || "").toLowerCase();
  if (t.includes("staff")) return "staff";
  if (t.includes("infant")) return "infant";
  if (t.includes("child")) return "child";
  if (t.includes("guest") || t.includes("adult")) return "guest";
  if (age !== null) {
    if (age < rules.infantMaxAge) return "infant";
    if (age <= rules.childMaxAge) return "child";
    return "guest";
  }
  return "guest";
}

export interface BreakdownItem { name: string; type: PaxType; age: number | null; price: number; label: string; }
export interface Breakdown { staff: string; items: BreakdownItem[]; total: number; }

export function computeBreakdown(staffName: string, pax: PaxRow[], rules: PaymentRules): Breakdown {
  let guestIdx = 0;
  const items: BreakdownItem[] = pax.map((p) => {
    const age = p.age !== "" && !isNaN(Number(p.age)) ? Number(p.age) : null;
    const cls = classify(p.type, age, rules);
    let price = 0, label = "";
    if (cls === "staff") { price = rules.staff; label = "Staff"; }
    else if (cls === "infant") { price = rules.infant; label = `Infant (under ${rules.infantMaxAge})`; }
    else if (cls === "child") { price = rules.child; label = "Child"; }
    else { price = rules.adultGuest[Math.min(guestIdx, rules.adultGuest.length - 1)]; label = `Adult guest ${guestIdx + 1}`; guestIdx++; }
    return { name: p.paxName, type: cls, age, price, label };
  });
  return { staff: staffName, items, total: items.reduce((s, i) => s + i.price, 0) };
}

/** Calculator: counts → total (guests are priced in order). */
export function calcTotal(guests: number, children: number, infants: number, rules: PaymentRules): number {
  let total = 0;
  for (let i = 0; i < guests; i++) total += rules.adultGuest[Math.min(i, rules.adultGuest.length - 1)];
  total += children * rules.child + infants * rules.infant;
  return total;
}
