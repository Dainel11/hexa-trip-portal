"use client";
import { useState } from "react";

export type SafariShopItem = { label: string; url: string };

/**
 * Safari Dinner shopping hub (Batch C-5).
 * One compact CTA button that expands a vertical mini-picker of up to
 * 4 apparel-category links, each sourced from Google Sheets Config
 * (safari_shop_url_1 … safari_shop_url_4).
 *
 * - Empty URLs are filtered OUT server-side before this renders.
 * - If ALL 4 are empty, the parent never mounts this component (guard).
 * - Expands inline (no absolute panel) so the card's overflow-hidden
 *   rounding never clips the list — zero layout traps on mobile.
 */
export default function SafariShopMenu({ items }: { items: SafariShopItem[] }) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;

  return (
    <div className="mt-3 text-center">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        🛒 Beli Pakaian &amp; Aksesori Safari
        <span aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      <div
        className={`grid overflow-hidden text-left transition-all duration-300 ease-in-out motion-reduce:transition-none ${open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <ul role="menu" className="min-h-0 space-y-1.5 rounded-xl border border-line bg-canvas/60 p-2">
          {items.map((it) => (
            <li key={it.label} role="none">
              <a
                role="menuitem"
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <span>{it.label}</span>
                <span aria-hidden className="shrink-0 text-brand">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
