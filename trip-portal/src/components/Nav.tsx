"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV, BOTTOM_NAV, SITE_NAME } from "@/lib/config";
import ThemeToggle from "./ThemeToggle";
import { toRenderableImage } from "./SmartImage";
import { MenuIcon, CloseIcon, HomeIcon, CalendarIcon, BusIcon, ShirtIcon, MapPinIcon, GridIcon } from "./icons";

const bottomIcon = (k: string, cn: string) =>
  k === "home" ? <HomeIcon className={cn} /> : k === "calendar" ? <CalendarIcon className={cn} />
  : k === "bus" ? <BusIcon className={cn} /> : k === "shirt" ? <ShirtIcon className={cn} />
  : <MapPinIcon className={cn} />;

export default function Nav({ logo }: { logo?: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const logoUrl = toRenderableImage((logo || "").trim());

  return (
    <>
      <header className="no-print sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-content items-center gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-8 w-auto" />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-sm font-bold text-white">H</span>
            )}
            <span className="font-display text-base font-semibold tracking-tight">{SITE_NAME}</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setOpen(true)} aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink/80 transition hover:bg-brand-soft lg:hidden">
              <MenuIcon />
            </button>
          </div>
        </div>
        {/* Desktop pill rail */}
        <nav className="no-scrollbar mx-auto hidden max-w-content gap-1 overflow-x-auto px-3 pb-2 lg:flex">
          {NAV.map((item) => {
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${active ? "bg-brand text-white" : "text-muted hover:bg-brand-soft hover:text-ink"}`}>
                <span className={`tag ${active ? "text-white/70" : "text-muted/60"}`}>{item.code}</span>{item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Mobile drawer (all pages) */}
      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-canvas shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <span className="font-display font-semibold">All sections</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full border border-line"><CloseIcon /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {NAV.map((item) => {
                const active = path === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition ${active ? "bg-brand text-white" : "text-ink hover:bg-brand-soft"}`}>
                    <span className={`tag ${active ? "text-white/70" : "text-muted/70"}`}>{item.code}</span>{item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-content items-stretch justify-around px-1">
          {BOTTOM_NAV.map((item) => {
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${active ? "text-brand" : "text-muted"}`}>
                {bottomIcon(item.icon, "h-6 w-6")}
                {item.label}
              </Link>
            );
          })}
          <button onClick={() => setOpen(true)}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] text-muted">
            <GridIcon className="h-6 w-6" /> More
          </button>
        </div>
      </nav>
    </>
  );
}
