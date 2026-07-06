"use client";
import { useMemo, useState } from "react";
import { Pill } from "./Card";
import { groupBy, rm } from "@/lib/format";
import { VehicleIcon } from "./icons";

type Item = Record<string, string>;
type Variant = "rooms" | "transport" | "tshirt" | "payment" | "shirtFamily";

/** Highlight only on a full match: the whole name, or a complete word in it.
 *  So "amsha" highlights AMSHA …, but "am" does not light up everyone. */
function isMatch(name: string, term: string): boolean {
  if (!term) return false;
  const n = (name || "").toLowerCase();
  return n === term || n.split(/\s+/).includes(term);
}

function YouBadge() {
  return <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">YOU</span>;
}
function LeaderBadge() {
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber"><span className="star-glow" role="img" aria-label="star">🌟</span> Room Leader</span>;
}

export default function SearchableList({
  items, fields, placeholder, variant, requireSearch = false, driverMinPax = 3, banners, summary, notFoundImg,
}: {
  items: Item[]; fields: string[]; placeholder: string; variant: Variant;
  requireSearch?: boolean; driverMinPax?: number;
  banners?: { src: string; label: string }[];
  summary?: React.ReactNode; notFoundImg?: string;
}) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const searching = term.length > 0;
  const groupVariant = variant === "rooms" || variant === "transport" || variant === "shirtFamily";
  const needSearch = requireSearch || groupVariant; // rooms, transport & family are search-driven
  const keyOf = (it: Item) =>
    (variant === "rooms" ? it["roomId"] : variant === "shirtFamily" ? it["staff"] : it["vehicleId"] || it["vehicle"]) || "—";

  // For group variants: show the WHOLE room/vehicle/family that contains a match.
  const groups = useMemo(() => {
    if (!groupVariant || !searching) return [];
    const all = groupBy(items, keyOf);
    return [...all.entries()].filter(([, members]) =>
      members.some((m) => fields.some((f) => (m[f] ?? "").toLowerCase().includes(term))),
    );
  }, [groupVariant, searching, items, term, fields]);

  // For row variants (tshirt): simple row filter.
  const rows = useMemo(() => {
    if (groupVariant || !term) return items;
    return items.filter((it) => fields.some((f) => (it[f] ?? "").toLowerCase().includes(term)));
  }, [groupVariant, term, items, fields]);

  const count = groupVariant ? groups.length : rows.length;
  const showResults = !needSearch || searching;

  return (
    <div>
      <div className="sticky top-[68px] z-10 -mx-4 mb-5 bg-canvas/90 px-4 py-2 backdrop-blur lg:top-[104px]">
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder}
            className="min-h-[44px] w-full rounded-full border border-line bg-surface py-3 pl-10 pr-4 text-base outline-none transition focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label={placeholder} type="search" enterKeyHint="search" />
        </div>
        {showResults && <p className="mt-1.5 pl-2 text-xs text-muted" aria-live="polite">{count} {groupVariant ? (count === 1 ? "match" : "matches") : (count === 1 ? "result" : "results")}{q && ` for “${q}”`}</p>}
      </div>

      {banners && banners.length > 0 && (
        <div aria-hidden={searching}
          className={`grid grid-cols-1 gap-4 overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none sm:grid-cols-2 ${searching ? "mb-0 max-h-0 opacity-0" : "mb-6 max-h-[440px] opacity-100"}`}>
          {banners.map((b) => (
            <figure key={b.label} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-b from-brand-soft/30 to-surface p-3">
                {b.src
                  ? <img src={b.src} alt={b.label} loading="lazy" className="h-full w-full object-contain" />
                  : <span className="tag text-muted">Image coming soon</span>}
              </div>
              <figcaption className="tag px-4 py-2 text-center font-medium uppercase text-muted">{b.label}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {summary && (
        <div aria-hidden={searching}
          className={`overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none ${searching ? "mb-0 max-h-0 opacity-0" : "mb-6 max-h-[600px] opacity-100"}`}>
          {summary}
        </div>
      )}

      {!showResults ? (
        summary ? null : (
        <div className="rounded-2xl border border-dashed border-line bg-surface/40 p-8 text-center">
          <p className="font-display text-lg font-medium">Type your name to search</p>
          <p className="mt-1 text-sm text-muted">{groupVariant ? "We'll show your full group and highlight you." : `e.g. ${items.slice(0, 2).map((i) => i.name).filter(Boolean).join(", ") || "your name"}`}</p>
        </div>
        )
      ) : count === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center">
          {notFoundImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={notFoundImg} alt="No results found" className="mx-auto mb-4 h-auto w-30 object-contain" />
          )}
          <p className="font-display font-bold">No participants found. Please check your spelling.</p>
        </div>
      ) : variant === "rooms" ? (
        <RoomsView groups={groups} term={term} />
      ) : variant === "transport" ? (
        <TransportView groups={groups} term={term} minPax={driverMinPax} />
      ) : variant === "shirtFamily" ? (
        <ShirtFamilyView groups={groups} term={term} />
      ) : variant === "tshirt" ? (
        <TshirtView rows={rows} />
      ) : (
        <PaymentView rows={rows} />
      )}
    </div>
  );
}

function RoomsView({ groups, term }: { groups: [string, Item[]][]; term: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map(([room, occ]) => {
        const hasYou = occ.some((o) => isMatch(o["name"], term));
        const leaderName = occ[0]?.["roomLeader"] || "";
        const leader = leaderName ? occ.find((o) => o["name"] === leaderName) : undefined;
        const members = occ.filter((o) => o !== leader);
        return (
          <div key={room} className={`rounded-2xl border bg-surface p-5 transition ${hasYou ? "glow-you border-brand" : "border-line"}`}>
            <div className="flex items-center justify-between gap-2">
              <Pill tone="brand">Room · {room}</Pill>
              <span className="flex items-center gap-2">
                {occ[0]?.["roomTypeLabel"] && <span className="text-sm font-medium uppercase text-muted">{occ[0]["roomTypeLabel"]}</span>}
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">{occ.length} Pax</span>
              </span>
            </div>
            {leader && (
              <p className="mt-3 flex flex-wrap items-center gap-2 border-b border-line/70 pb-2.5">
                <LeaderBadge />
                <span className={isMatch(leader["name"], term) ? "font-bold text-brand" : "font-semibold"}>{leader["name"]}</span>
                {isMatch(leader["name"], term) && <YouBadge />}
              </p>
            )}
            <ul className="mt-3 space-y-1.5">
              {members.map((o, i) => {
                const you = isMatch(o["name"], term);
                return (
                  <li key={i} className={`flex items-center gap-2 border-t border-line/70 pt-1.5 first:border-0 first:pt-0 ${you ? "font-bold text-brand" : ""}`}>
                    {o["name"]}{you && <YouBadge />}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function ShirtFamilyView({ groups, term }: { groups: [string, Item[]][]; term: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map(([staff, ppl]) => {
        const hasYou = ppl.some((p) => isMatch(p["name"], term));
        const owner = ppl.find((p) => !(p["relationship"] || "")) ?? ppl[0];
        const family = ppl.filter((p) => p !== owner);
        const sizeOf = (p: Item) => sizeOrBlank(p["size"] || p["safariSize"]);
        return (
          <div key={staff} className={`rounded-2xl border bg-surface p-5 transition ${hasYou ? "glow-you border-brand" : "border-line"}`}>
            <div className="flex items-center justify-between gap-2">
              <Pill tone="brand">Family</Pill>
              <span className="tag text-muted">{ppl.length} {ppl.length === 1 ? "person" : "people"}</span>
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-2 border-b border-line/70 pb-2.5">
              <span className={isMatch(owner["name"], term) ? "font-bold text-brand" : "font-semibold"}>{owner["name"]}</span>
              {isMatch(owner["name"], term) && <YouBadge />}
              <span className="ml-auto">{sizeOf(owner) ? <Pill tone="amber">{sizeOf(owner)}</Pill> : <span className="tag text-muted">size TBC</span>}</span>
            </p>
            {family.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {family.map((f, i) => {
                  const you = isMatch(f["name"], term);
                  const sz = sizeOf(f);
                  return (
                    <li key={i} className={`flex items-center gap-2 text-sm ${you ? "font-bold text-brand" : ""}`}>
                      {f["relationship"] && <span className="tag text-muted">{f["relationship"]}</span>}
                      <span>{f["name"]}</span>{you && <YouBadge />}
                      <span className="ml-auto">{sz ? <Pill tone="water">{sz}</Pill> : <span className="tag text-muted">TBC</span>}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TransportView({ groups, term, minPax }: { groups: [string, Item[]][]; term: string; minPax: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map(([veh, ppl]) => {
        const type = (ppl[0]?.["vehicleType"] || "CAR").toUpperCase();
        const isCar = type === "CAR";
        const driver = ppl.find((p) => p["isDriver"] === "1");
        const plate = ppl.find((p) => p["plate"])?.["plate"];
        const pic = ppl.find((p) => p["pic"])?.["pic"];
        // Eligibility is computed server-side (rule C: brought family OR car carries minPax incl. driver).
        const eligible = ppl.some((p) => p["eligible"] === "1");
        const hasYou = ppl.some((p) => isMatch(p["name"], term));
        return (
          <div key={veh} className={`rounded-2xl border bg-surface p-5 transition ${hasYou ? "glow-you border-brand" : "border-line"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-water/15 text-water"><VehicleIcon vehicle={veh} className="h-7 w-7" /></span>
              <span className="font-display text-xl font-semibold">{veh}</span>
              {isCar && plate && <span className="tag rounded-full bg-line px-2 py-0.5 text-muted">{plate}</span>}
              <span className="ml-auto tag text-muted">{ppl.length} pax</span>
            </div>

            {driver && (
              <p className="mt-3 text-sm"><span className="tag text-amber">Driver</span>{" "}
                <span className={isMatch(driver["name"], term) ? "font-bold text-brand" : "font-medium"}>{driver["name"]}</span>
                {isMatch(driver["name"], term) && <> <YouBadge /></>}
                {eligible && <span className="badge-glow ml-2 rounded-full bg-brand-soft px-2 py-0.5 tag text-brand">Allowance eligible</span>}
              </p>
            )}
            {!isCar && pic && <p className="mt-2 text-sm text-muted"><span className="tag">PIC</span> {pic}</p>}

            <ul className="mt-3 space-y-1.5">
              {ppl.filter((p) => p !== driver).map((p, i) => {
                const you = isMatch(p["name"], term);
                return <li key={i} className={`flex items-center gap-2 border-t border-line/70 pt-1.5 text-sm first:border-0 first:pt-0 ${you ? "font-bold text-brand" : ""}`}><span aria-hidden className="text-muted">·</span>{p["name"]}{you && <YouBadge />}</li>;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function sizeOrBlank(v: string): string {
  // ROSTER_SYSTEM stores curated sizes: letters (S–7XL) AND valid kids' numeric sizes (22–34).
  const t = (v || "").trim();
  return t; // trust the sheet; only truly empty is blank
}

function TshirtView({ rows }: { rows: Item[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {rows.map((r, i) => {
        const safari = sizeOrBlank(r["safariSize"]);
        const water = sizeOrBlank(r["waterworldSize"]);
        return (
          <li key={i} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
            <span className="font-medium">{r["name"]}</span>
            <span className="flex gap-2">
              {safari && <Pill tone="amber">Safari {safari}</Pill>}
              {water && <Pill tone="water">Water {water}</Pill>}
              {!safari && !water && <span className="tag text-muted">size TBC</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function PaymentView({ rows }: { rows: Item[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-brand-soft text-left"><tr className="tag text-brand"><th className="px-4 py-3">Staff / Family</th><th className="px-4 py-3 text-center">Pax</th><th className="px-4 py-3 text-right">Amount</th></tr></thead>
        <tbody>{rows.map((r, i) => (<tr key={i} className="border-t border-line bg-surface"><td className="px-4 py-3 font-medium">{r["familyGroup"]}</td><td className="px-4 py-3 text-center">{r["paxCount"] || "—"}</td><td className="px-4 py-3 text-right font-semibold">{rm(r["amountDue"])}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
