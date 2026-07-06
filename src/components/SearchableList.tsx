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
  const [isMapOpen, setIsMapOpen] = useState(false);
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
      {/* 🗺️ Smart Map Popup Button (Locker Style) - Placed ABOVE Search Bar */}
      {variant === "rooms" && (
        <div className="mb-4 text-center sm:text-left">
          <button
            onClick={() => setIsMapOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-[#0e6e5c] shadow-sm transition hover:bg-amber-500 animate-pulse focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            🗺️ Lihat Peta Lokasi Blok Condo D'Savoy (Penting!)
          </button>
        </div>
      )}

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
          className={`grid grid-cols-1 gap-6 w-full mx-auto ${searching ? "mb-0 max-h-0 opacity-0" : "mb-6 opacity-100"}`}>
          {banners.map((b) => (
            <figure key={b.label} className="overflow-hidden rounded-2xl border border-line bg-surface w-full">
              <div className="flex items-center justify-center bg-gradient-to-b from-brand-soft/30 to-surface p-4 w-full">
                {b.src
                  ? <img src={b.src} alt={b.label} loading="lazy" className="w-full max-w-3xl h-auto object-contain mx-auto rounded-xl shadow-sm" />
                  : <span className="tag text-muted">Image coming soon</span>}
              </div>
              <figcaption className="tag px-4 py-2.5 text-center font-medium uppercase text-muted border-t border-line/50 bg-canvas">{b.label}</figcaption>
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
            <img src={notFoundImg} alt="No results found" className="mx-auto mb-4 h-auto w-28 object-contain" />
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

      {/* 🔑 Premium Modal Popup Overlay for Rooms Map */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-xl">
            <div className="max-h-[75vh] overflow-y-auto rounded-xl border border-line bg-white p-1">
              <img 
                src="https://image2url.com" 
                className="w-full h-auto object-contain rounded-lg" 
                alt="Condo D'Savoy Map" 
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsMapOpen(false)}
                className="rounded-full bg-line px-5 py-2 text-xs font-semibold text-foreground transition hover:bg-line/80 focus:outline-none"
              >
                Tutup Peta
              </button>
            </div>
          </div>
        </div>
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
