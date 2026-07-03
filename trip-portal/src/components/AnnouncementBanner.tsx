"use client";
import { useEffect, useState } from "react";

export default function AnnouncementBanner({ title, text }: { title?: string; text?: string }) {
  const [show, setShow] = useState(false);
  const key = "ann:" + (text ?? "").slice(0, 40);
  useEffect(() => {
    if (!text) return;
    try { if (localStorage.getItem(key) !== "1") setShow(true); } catch { setShow(true); }
  }, [text, key]);
  if (!text || !show) return null;
  return (
    <div className="no-print border-b border-amber/30 bg-amber/10">
      <div className="mx-auto flex max-w-content items-start gap-3 px-4 py-3">
        <span aria-hidden className="text-lg leading-none">📢</span>
        <div className="flex-1 text-sm">
          {title && <span className="font-semibold">{title} </span>}
          <span className="text-ink/90">{text}</span>
        </div>
        <button aria-label="Dismiss" onClick={() => { setShow(false); try { localStorage.setItem(key, "1"); } catch {} }}
          className="text-muted hover:text-ink">✕</button>
      </div>
    </div>
  );
}
