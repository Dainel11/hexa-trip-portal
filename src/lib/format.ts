export function rm(value: string | number | undefined): string {
  if (value === undefined || value === "" || value === null) return "—";
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(n)) return String(value);
  return `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/* ─── Malaysian phone normalization (one source of truth) ───
   Accepts almost any format HR types and returns the "significant"
   number after +60 (no trunk 0). Examples all → "163949558":
   "163949558" | "0163949558" | "60163949558" | "+60 16-394 9558" */
export function phoneCore(raw: string | number | undefined): string {
  let d = String(raw ?? "").replace(/\D/g, "");
  d = d.replace(/^00/, "");           // intl dial prefix
  if (d.startsWith("60")) return d.slice(2);
  if (d.startsWith("0")) return d.slice(1);
  return d;
}

/** Pretty display, e.g. "+60 16-394 9558". */
export function phoneDisplay(raw: string | number | undefined): string {
  const c = phoneCore(raw);
  if (!c) return "";
  if (c.startsWith("1") && c.length === 9) return `+60 ${c.slice(0, 2)}-${c.slice(2, 5)} ${c.slice(5)}`;
  if (c.startsWith("1") && c.length === 10) return `+60 ${c.slice(0, 2)}-${c.slice(2, 6)} ${c.slice(6)}`;
  return `+60 ${c}`;
}

export function phoneE164(raw: string | number | undefined): string {
  const c = phoneCore(raw);
  return c ? `+60${c}` : "";
}
export function telHref(raw: string | number | undefined): string {
  const e = phoneE164(raw);
  return e ? `tel:${e}` : "";
}
export function waHref(raw: string | number | undefined): string {
  const c = phoneCore(raw);
  return c ? `https://wa.me/60${c}` : "";
}
/** Back-compat alias. */
export const displayPhone = phoneDisplay;

export function groupBy<T>(rows: T[], key: (r: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const r of rows) {
    const k = key(r) || "—";
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(r);
  }
  return map;
}
