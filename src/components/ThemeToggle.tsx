"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink/80 transition hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
    >
      <span aria-hidden className="text-base">{dark ? "☀" : "☾"}</span>
    </button>
  );
}
