"use client";
import { useMemo, useState } from "react";
import { Pill } from "./Card";
import { groupBy, rm } from "@/lib/format";
import { VehicleIcon } from "./icons";

type Item = Record<string, string>;
type Variant = "rooms" | "transport" | "tshirt" | "payment";

function statusTone(s: string): "brand" | "amber" | "muted" {
  const v = s.toLowerCase();
  if (v.includes("paid")) return "brand";
  if (v.includes("partial")) return "amber";
  return "muted";
}

export default function SearchableList({
  items, fields, placeholder, variant, requireSearch = false,
}: {
  items: Item[]; fields: string[]; placeholder: string; variant: Variant; requireSearch?: boolean;
}) {
  const [q, setQ] = useState("");
  const searching = q.trim().length > 0;
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => fields.some((f) => (it[f] ?? "").toLowerCase().includes(term)));
  }, [q, items, fields]);

  // Don't dump the whole list before searching (cleaner).
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
        {showList && (
          <p className="mt-1.5 pl-2 text-xs text-muted">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}{q && ` for “${q}”`}
          </p>
        )}
      </div>

      {!showList ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/40 p-8 text-center">
          <p className="font-display text-lg font-medium">Type your name to search</p>
          <p className="mt-1 text-sm text-muted">e.g. {items.slice(0, 2).map((i) => i.name).filter(Boolean).join(", ") || "your name"}</p>
        </div>
      ) : filtered.length ? (
        <>
          {variant === "rooms" && <RoomsView rows={filtered} />}
          {variant === "transport" && <TransportView rows={filtered} searching={searching} />}
          {variant === "tshirt" && <TshirtView rows={filtered} />}
          {variant === "payment" && <PaymentView rows={filtered} />}
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">No matches. Check the spelling or try a shorter name.</p>
      )}
    </div>
  );
}

function RoomsView({ rows }: { rows: Item[] }) {
  const byRoom = groupBy(rows, (r) => r["roomId"]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...byRoom.entries()].map(([room, occ]) => {
        const leader = occ.find((o) => o["roomLeader"])?.["roomLeader"];
        return (
          <div key={room} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <Pill tone="brand">Room · {room}</Pill>
              {occ[0]?.["roomType"] && <span className="tag text-muted">{occ[0]["roomType"]}</span>}
            </div>
            {leader && (<p className="mt-3 text-sm"><span className="tag text-amber">Leader</span> <span className="font-medium">{leader}</span></p>)}
            <ul className="mt-3 space-y-1.5">
              {occ.map((o, i) => (
                <li key={i} className="flex items-center justify-between border-t border-line/70 pt-1.5 first:border-0 first:pt-0">
                  <span className={o["name"] === leader ? "font-medium" : ""}>{o["name"]}</span>
                  {o["costType"] && <span className="tag text-muted">{o["costType"]}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function TransportView({ rows, searching }: { rows: Item[]; searching: boolean }) {
  const byVeh = groupBy(rows, (r) => r["vehicle"]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...byVeh.entries()].map(([veh, ppl]) => {
        const plate = ppl.find((p) => p["plate"])?.["plate"];
        return (
          <div key={veh} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-water/15 text-water"><VehicleIcon vehicle={veh} className="h-7 w-7" /></span>
              <span className="font-display text-xl font-semibold">{veh}</span>
              {/* Plate hidden until the user searches (reduces clutter) */}
              {searching && plate && <span className="tag rounded-full bg-line px-2 py-0.5 text-muted">{plate}</span>}
              <span className="ml-auto tag text-muted">{ppl.length} pax</span>
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {ppl.map((p, i) => <li key={i} className="text-sm">{p["name"]}</li>)}
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
        <thead className="bg-brand-soft text-left">
          <tr className="tag text-brand"><th className="px-4 py-3">Family</th><th className="px-4 py-3 text-right">Paid</th><th className="px-4 py-3 text-right">Balance</th><th className="px-4 py-3">Status</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line bg-surface">
              <td className="px-4 py-3 font-medium">{r["familyGroup"]}</td>
              <td className="px-4 py-3 text-right">{rm(r["amountPaid"])}</td>
              <td className="px-4 py-3 text-right">{rm(r["balance"])}</td>
              <td className="px-4 py-3">{r["status"] && <Pill tone={statusTone(r["status"])}>{r["status"]}</Pill>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
