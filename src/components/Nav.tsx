"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SITE_NAME } from "@/lib/config";
import ThemeToggle from "./ThemeToggle";

export default function Nav({ logo }: { logo?: string }) {
  const path = usePathname();
  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="h-7 w-auto" />
          ) : (
            <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-sm font-bold text-white">H</span>
          )}
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">{SITE_NAME}</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      <nav className="no-scrollbar mx-auto flex max-w-content gap-1 overflow-x-auto px-3 pb-2">
        {NAV.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
                active ? "bg-brand text-white" : "text-muted hover:bg-brand-soft hover:text-ink"
              }`}
            >
              <span className={`tag ${active ? "text-white/70" : "text-muted/60"}`}>{item.code}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
