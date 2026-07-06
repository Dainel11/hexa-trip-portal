"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MapAccordion({ image, label }: { image: string; label: string }) {
  const [open, setOpen] = useState(false);
  if (!image) return null;
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-surface">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left font-medium transition hover:bg-brand-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
        <span>{label}</span>
        <span className={`text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>▾</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="overflow-hidden">
            <div className="px-4 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Condo D'Savoy Map" className="mx-auto h-auto w-full max-w-4xl rounded-xl border border-line object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
