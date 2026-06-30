"use client";
import { useMemo, useState } from "react";
import { Pill } from "./Card";
import { groupBy, rm } from "@/lib/format";
import { VehicleIcon } from "./icons";

type Item = Record<string, string>;
type Variant = "rooms" | "transport" | "tshirt" | "payment";

function YouBadge() {
  return <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">YOU</span>;
}

export default function SearchableList({
  items, fields, placeholder, variant, requireSearch = false, driverMinPax = 3,
}: {
  items: Item[]; fields: string[]; placeholder: string; variant: Variant;
  requireSearch?: boolean; driverMinPax?: number;
}) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const searching = term.length > 0;
  const filtered = useMemo(() => {
    if (!term) return items;
    return items.filter((it) => fields.some((f) => (it[f] ?? "").toLowerCase().includes(term)));
  }, [term, items, fields]);

  const isYou = (name: string) => searching && (name ?? "").toLowerCase().includes(term);
  const showList = !requireSearch || searching;

  return (
    <div>
      <div className="sticky top-[68px] z-10 -mx-4 mb-5 bg-canvas/90 px-4 py-2 backdrop-blur lg:top-[104px]">
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder}
            className="w-full rounded-full border border-line bg-surface py-3 pl-10 pr-4 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
            aria-label={placeholder} />
        </div>
        {showList && <p className="mt-1.5 pl-2 text-xs text-muted">{filtered.length} {filtered.length === 1 ? "result" : "results"}{q && ` for “${q}”`}</p>}
      </div>

      {!showList ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/40 p-8 text-center">
          <p className="font-display text-lg font-medium">Type your name to search</p>
          <p className="mt-1 text-sm text-muted">e.g. {items.slice(0, 2).map((i) => i.name).filter(Boolean).join(", ") || "your name"}</p>
        </div>
      ) : filtered.length ? (
        <>
          {variant === "rooms" && <RoomsView rows={filtered} isYou={isYou} />}
          {variant === "transport" && <TransportView rows={filtered} isYou={isYou} searching={searching} minPax={driverMinPax} />}
          {variant === "tshirt" && <TshirtView rows={filtered} />}
          {variant === "payment" && <PaymentView rows={filtered} />}
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">No matches. Check the spelling or try a shorter name.</p>
      )}
    </div>
  );
}

function RoomsView({ rows, isYou }: { rows: Item[]; isYou: (n: string) => boolean }) {
  const byRoom = groupBy(rows, (r) => r["roomId"]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...byRoom.entries()].map(([room, occ]) => {
        const hasYou = occ.some((o) => isYou(o["name"]));
        return (
          <div key={room} className={`rounded-2xl border bg-surface p-5 transition ${hasYou ? "glow-you border-brand" : "border-line"}`}>
            <div className="flex items-center justify-between gap-2">
              <Pill tone="brand">Room · {room}</Pill>
              {occ[0]?.["roomTypeLabel"] && <span className="text-sm font-medium text-muted">{occ[0]["roomTypeLabel"]}</span>}
            </div>
            <ul className="mt-3 space-y-1.5">
              {occ.map((o, i) => {
                const you = isYou(o["name"]);
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

function TransportView({ rows, isYou, searching, minPax }: { rows: Item[]; isYou: (n: string) => boolean; searching: boolean; minPax: number }) {
  const byVeh = groupBy(rows, (r) => r["vehicleId"] || r["vehicle"]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...byVeh.entries()].map(([veh, ppl]) => {
        const type = (ppl[0]?.["vehicleType"] || "CAR").toUpperCase();
        const isCar = type === "CAR";
        const driver = ppl.find((p) => p["isDriver"] === "true" || p["isDriver"] === "1");
        const plate = ppl.find((p) => p["plate"])?.["plate"];
        const pic = ppl.find((p) => p["pic"])?.["pic"];
        const passengers = ppl.length - (driver ? 1 : 0);
        const eligible = (type === "CAR" || type === "VAN") && passengers >= minPax;
        const hasYou = ppl.some((p) => isYou(p["name"]));
        return (
          <div key={veh} className={`rounded-2xl border bg-surface p-5 transition ${hasYou ? "glow-you border-brand" : "border-line"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-water/15 text-water"><VehicleIcon vehicle={veh} className="h-7 w-7" /></span>
              <span className="font-display text-xl font-semibold">{veh}</span>
              {/* Plate only for cars (for tracing); bus/van use PIC */}
              {isCar && plate && <span className="tag rounded-full bg-line px-2 py-0.5 text-muted">{plate}</span>}
              <span className="ml-auto tag text-muted">{ppl.length} pax</span>
            </div>

            {driver && (
              <p className="mt-3 text-sm"><span className="tag text-amber">Driver</span>{" "}
                <span className={isYou(driver["name"]) ? "font-bold text-brand" : "font-medium"}>{driver["name"]}</span>
                {isYou(driver["name"]) && <> <YouBadge /></>}
                {eligible && <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 tag text-brand">Allowance eligible</span>}
              </p>
            )}
            {!isCar && pic && <p className="mt-2 text-sm text-muted"><span className="tag">PIC</span> {pic}</p>}

            <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {ppl.filter((p) => !(driver && p === driver)).map((p, i) => {
                const you = isYou(p["name"]);
                return <li key={i} className={`flex items-center gap-2 text-sm ${you ? "font-bold text-brand" : ""}`}>{p["name"]}{you && <YouBadge />}</li>;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function TshirtView({ rows }: { rows: Item[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {rows.map((r, i) => (
        <li key={i} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
          <span className="font-medium">{r["name"]}</span>
          <span className="flex gap-2">
            {r["safariSize"] && <Pill tone="amber">Safari {r["safariSize"]}</Pill>}
            {r["waterworldSize"] && <Pill tone="water">Water {r["waterworldSize"]}</Pill>}
          </span>
        </li>
      ))}
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
