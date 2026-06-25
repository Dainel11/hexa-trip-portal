import Link from "next/link";
import { getEventInfo } from "@/lib/sheets";
import { NAV, REVALIDATE_SECONDS } from "@/lib/config";
import SmartImage from "@/components/SmartImage";
import { Pill } from "@/components/Card";

export const revalidate = 60;

export default async function Home() {
  const info = await getEventInfo();
  const dates = [info.startDate, info.endDate].filter(Boolean).join(" – ");
  const quick = NAV.filter((n) => n.href !== "/");

  return (
    <>
      <section className="contour relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-content gap-8 px-4 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="reveal">
            <p className="tag text-brand">Company Trip · Field Guide</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {info.eventName || "Company Trip"}
            </h1>
            {info.tagline && <p className="mt-4 max-w-xl text-lg text-muted">{info.tagline}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              {info.location && <Pill tone="brand">📍 {info.location}</Pill>}
              {dates && <Pill tone="amber">🗓 {dates}</Pill>}
            </div>
          </div>
          {info.heroImage && (
            <div className="reveal overflow-hidden rounded-3xl border border-line shadow-sm">
              <SmartImage src={info.heroImage} alt={info.eventName} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-10">
        <p className="tag text-muted">Jump to</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {quick.map((n) => (
            <Link key={n.href} href={n.href}
              className="group rounded-2xl border border-line bg-surface p-4 transition hover:border-brand hover:shadow-sm">
              <span className="tag text-muted/60">{n.code}</span>
              <p className="mt-2 font-display text-lg font-medium tracking-tight group-hover:text-brand">{n.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
