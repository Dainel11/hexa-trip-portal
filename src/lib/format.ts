export function rm(value: string | number | undefined): string {
  if (value === undefined || value === "" || value === null) return "—";
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(n)) return String(value);
  return `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/** Ensure a leading "+" even if Google Sheets stripped it from a numeric cell. */
export function displayPhone(phone: string): string {
  let t = (phone ?? "").trim();
  if (!t) return "";
  if (!t.startsWith("+")) t = "+" + t.replace(/^\++/, "");
  return t;
}
export function telHref(phone: string): string {
  return "tel:" + displayPhone(phone).replace(/[^\d+]/g, "");
}

export function groupBy<T>(rows: T[], key: (r: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const r of rows) {
    const k = key(r) || "—";
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(r);
  }
  return map;
}
