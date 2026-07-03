"use client";
export default function PrintButton({ label = "Print itinerary" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span aria-hidden>⎙</span> {label}
    </button>
  );
}
