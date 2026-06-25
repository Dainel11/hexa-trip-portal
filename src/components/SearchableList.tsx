"use client";
import { useMemo, useState } from "react";

type Item = Record<string, string>;

export default function SearchableList({
  items, fields, placeholder, render,
}: {
  items: Item[];
  fields: string[];            // which fields to search across
  placeholder: string;
  render: (filtered: Item[]) => React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) =>
      fields.some((f) => (it[f] ?? "").toLowerCase().includes(term))
    );
  }, [q, items, fields]);

  return (
    <div>
      <div className="sticky top-[104px] z-10 -mx-4 mb-5 bg-canvas/90 px-4 py-2 backdrop-blur">
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-full border border-line bg-surface py-3 pl-10 pr-4 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
            aria-label={placeholder}
          />
        </div>
        <p className="mt-1.5 pl-2 text-xs text-muted">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
          {q && ` for “${q}”`}
        </p>
      </div>
      {filtered.length ? render(filtered) : (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
          No matches. Check the spelling or try a shorter name.
        </p>
      )}
    </div>
  );
}
