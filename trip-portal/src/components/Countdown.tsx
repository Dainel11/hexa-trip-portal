"use client";
import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    mins: Math.floor((ms % 3600000) / 60000),
    done: ms === 0,
  };
}

export default function Countdown({ date }: { date: string }) {
  const target = Date.parse(date);
  const [t, setT] = useState(() => (isNaN(target) ? null : diff(target)));
  useEffect(() => {
    if (isNaN(target)) return;
    const id = setInterval(() => setT(diff(target)), 30000);
    return () => clearInterval(id);
  }, [target]);
  if (!t) return null;

  const cell = (n: number, l: string) => (
    <div className="flex flex-col items-center rounded-xl bg-surface px-4 py-3 sm:px-6">
      <span className="font-display text-3xl font-semibold text-brand sm:text-4xl tabular-nums">{n}</span>
      <span className="tag text-muted">{l}</span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-center">
      <p className="tag text-brand">{t.done ? "The trip is here!" : "Trip starts in"}</p>
      {!t.done && (
        <div className="mt-3 flex justify-center gap-3">
          {cell(t.days, "Days")}{cell(t.hours, "Hours")}{cell(t.mins, "Mins")}
        </div>
      )}
    </div>
  );
}
