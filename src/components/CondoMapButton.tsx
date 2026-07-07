"use client";
import { useEffect, useState } from "react";

/**
 * Twin of the LockerInfo CTA on Payment page — same yellow bg, teal text,
 * and pulse-glow rhythm. Tapping opens a centered modal that displays the
 * Condo D'Savoy map image sourced from Config → `rooms_map_image`.
 *
 * Fails soft: renders nothing when no image URL is supplied.
 */
export default function CondoMapButton({
  image,
  label,
}: {
  image: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  // Close on ESC + lock body scroll while the map modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!image) return null;

  return (
    <div className="mb-6 text-center">
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="animate-pulse-glow inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#0e6e5c] shadow-sm ring-1 ring-black/5 transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        style={{ backgroundColor: "#facc15" }}
      >
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Peta Lokasi Blok Condo D'Savoy"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 pt-10 backdrop-blur-sm sm:items-center sm:pt-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-modal-in relative w-full max-w-4xl rounded-2xl border border-line bg-canvas p-4 shadow-2xl sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-display text-base font-semibold sm:text-lg">
                🗺️ Peta Lokasi Blok Condo D&apos;Savoy
              </h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close map"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-lg leading-none transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                ×
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Condo D'Savoy Map"
              loading="eager"
              fetchPriority="high"
              className="mx-auto h-auto max-h-[75vh] w-full rounded-xl border border-line object-contain"
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
