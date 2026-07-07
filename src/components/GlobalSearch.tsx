"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DirectoryEntry } from "@/lib/types";

function Field({ label, children, href }: { label: string; children: React.ReactNode; href?: string }) {
  const body = (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition hover:border-brand">
      <div className="min-w-0">
        <p className="tag text-muted">{label}</p>
        <div className="mt-0.5 font-medium">{children}</div>
      </div>
      {href && <span aria-hidden className="shrink-0 text-brand">→</span>}
    </div>
  );
  return href ? <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-xl">{body}</Link> : body;
}

export default function GlobalSearch({ entries, notFoundImg }: { entries: DirectoryEntry[]; notFoundImg?: string }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<DirectoryEntry | null>(null);
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return [];
    return entries
      .filter((e) =>
        e.name.toLowerCase().includes(term) ||
        e.aliases.some((a) => a.toLowerCase().includes(term)) ||
        e.family.some((f) => f.name.toLowerCase().includes(term)),
      )
      .slice(0, 8);
  }, [term, entries]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSel(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="mx-auto w-full max-w-xl text-center">
      <p className="tag text-brand">Find anyone</p>
      <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Search the whole trip</h2>
      <p className="mt-1 text-sm text-muted">Type a name — yours or a family member’s — to see room, transport, shirt and more.</p>

      <div className="relative mt-4 text-left">
        <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" enterKeyHint="search"
          placeholder="Search a name…" aria-label="Search anyone on the trip"
          className="min-h-[48px] w-full rounded-full border border-line bg-surface py-3 pl-11 pr-4 text-base shadow-sm outline-none transition focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/40" />

        {term && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-lg" role="listbox">
            {results.length ? results.map((e) => (
              <button key={e.empId} onClick={() => { setSel(e); }} role="option"
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition hover:bg-brand-soft/40 focus-visible:bg-brand-soft/40 focus-visible:outline-none">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{e.name}</span>
                  <span className="tag block truncate text-muted">
                    {[e.roomId, e.vehicleId, e.size ? `Size ${e.size}` : ""].filter(Boolean).join(" · ") || "—"}
                  </span>
                  {e.family.length > 0 && (
                    <span className="tag block truncate text-muted/80">+{e.family.length} family: {e.family.map((f) => f.name).join(", ")}</span>
                  )}
                </span>
                {e.isLeader && <span className="shrink-0 rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber"><span className="star-glow" role="img" aria-label="star">🌟</span> Leader</span>}
              </button>
            )): (
              <div className="px-4 py-6 text-center">
                {notFoundImg && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={notFoundImg} alt="No results found" className="mx-auto mb-3 h-auto w-24 object-contain" />
                )}
                <p className="font-display font-bold">No participants found. Please check your spelling.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {sel && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 pt-32 backdrop-blur-sm sm:items-center sm:pt-4"
          role="dialog" aria-modal="true" aria-label={`Details for ${sel.name}`} onClick={() => setSel(null)}>
          <div className="animate-modal-in max-h-[80vh] sm:max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-canvas p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight">{sel.name}</h3>
                <p className="mt-0.5 text-sm text-muted">
                  {sel.age ? `${sel.age} yrs` : "Age —"} · {sel.vegetarian}
                </p>
                {sel.isLeader && <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-bold uppercase text-amber"><span className="star-glow" role="img" aria-label="star">🌟</span> Room Leader</span>}
              </div>
              <button onClick={() => setSel(null)} aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg leading-none hover:bg-surface focus-visible:ring-2 focus-visible:ring-brand/40">×</button>
            </div>

            <div className="mt-4 space-y-2.5">
              <Field label="Room" href="/rooms">
                {sel.roomId ? <>{sel.roomId}{sel.roomLabel ? ` · ${sel.roomLabel}` : ""}</> : "Not assigned"}
                {sel.roomLeader && <span className="mt-0.5 block text-xs font-normal text-muted">Leader: {sel.roomLeader}{sel.isLeader ? " (you)" : ""}</span>}
              </Field>

              <Field label="Transport" href="/transport">
                {sel.vehicleId
                  ? <>{sel.vehicleType || "Vehicle"} {sel.vehicleId}{sel.plate && sel.plate !== sel.vehicleId ? ` · ${sel.plate}` : ""}{sel.isDriver ? " — Driver" : ""}</>
                  : "Not assigned"}
              </Field>

              <Field label="Shirt & dress code" href="/shirts">
                {sel.size ? `Size ${sel.size}` : "Size TBC"}
              </Field>

              <Field label="Dietary preference">{sel.vegetarian}</Field>

              {(sel.emergencyPhone || sel.emergencyName) && (
                <Field label="Emergency contact">
                  {sel.emergencyPhone || "—"}
                  {(sel.emergencyName || sel.emergencyRelationship) && (
                    <span className="mt-0.5 block text-xs font-normal text-muted">
                      {sel.emergencyName}{sel.emergencyRelationship ? ` (${sel.emergencyRelationship})` : ""}
                    </span>
                  )}
                </Field>
              )}

              <Field label={`Family (${sel.family.length})`} href="/shirts">
                {sel.family.length
                  ? <ul className="space-y-0.5 font-normal">
                      {sel.family.map((f, i) => (
                        <li key={i} className="text-sm">
                          {f.relationship && <span className="tag text-muted">{f.relationship} </span>}
                          {f.name}
                          <span className="text-muted">{f.age ? ` · ${f.age}y` : ""}{f.size ? ` · ${f.size}` : ""}</span>
                        </li>
                      ))}
                    </ul>
                  : <span className="font-normal text-muted">No family members registered</span>}
              </Field>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
