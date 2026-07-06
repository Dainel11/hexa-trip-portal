import Link from "next/link";
import { getEventInfo, getContacts, getItinerary, getSettings, getDirectory } from "@/lib/sheets";
import { NAV, numSetting, MEAL_ALLOWANCE_DEFAULT, DRIVER_ALLOWANCE_DEFAULT } from "@/lib/config";
import SmartImage from "@/components/SmartImage";
import Countdown from "@/components/Countdown";
import GlobalSearch from "@/components/GlobalSearch";
import Reveal from "@/components/Reveal";
import { Pill } from "@/components/Card";
import { phoneDisplay, telHref, groupBy, rm } from "@/lib/format";
import { PhoneIcon } from "@/components/icons";

export const revalidate = 60;

function dayKey(d: string): string {
  const t = Date.parse(d.replace(/^[A-Za-z]+,\s*/, ""));
  return isNaN(t) ? "" : new Date(t).toDateString();
}

export default async function Home() {
  const [info, contacts, itinerary, settings, directory] = await Promise.all([getEventInfo(), getContacts(), getItinerary(), getSettings(), getDirectory()]);
  const meal = numSetting(settings, "meal_allowance_per_pax", MEAL_ALLOWANCE_DEFAULT);
  const driverAmount = numSetting(settings, "driver_allowance_amount", DRIVER_ALLOWANCE_DEFAULT);
  const dates = [info.startDate, info.endDate].filter(Boolean).join(" – ");
  const quick = NAV.filter((n) => n.href !== "/");
  const emergency = contacts.slice(0, 4);

  // Smart card: today's schedule (falls back to Day 1 preview before the trip)
  const today = new Date().toDateString();
  const todays = itinerary.filter((i) => dayKey(i.date) === today);
  const days = [...groupBy(itinerary, (i) => i.date).entries()];
  const isToday = todays.length > 0;
  const scheduleDay = isToday ? todays : (days[0]?.[1] ?? []);
  const scheduleLabel = isToday ? "Today's schedule" : days[0] ? `Day 1 · ${days[0][0]}` : "";

  return (
    <>
      <section className="contour border-b border-line">
        <div className="mx-auto grid max-w-content items-center gap-6 px-4 py-8 sm:py-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="reveal">
            <p className="tag text-brand">Company Trip · Field Guide</p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{info.eventName || "Company Trip"}</h1>
            {info.tagline && <p className="mt-3 max-w-xl text-muted">{info.tagline}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {info.location && <Pill tone="brand">📍 {info.location}</Pill>}
              {dates && <Pill tone="amber">🗓 {dates}</Pill>}
            </div>
          </div>
          {info.heroImage && (
            <div className="reveal overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <SmartImage src={info.heroImage} alt={info.eventName} className="mx-auto max-h-72 w-full object-contain" />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-10 px-4 py-8">
        <Reveal><GlobalSearch entries={directory} notFoundImg={settings.not_found_pixel_image || ""} /></Reveal>

        {info.startDate && <Reveal delay={0.05}><Countdown date={info.startDate} /></Reveal>}

        <Reveal delay={0.1}>
        <section className="grid items-stretch gap-4 sm:grid-cols-2">
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-brand/25 bg-surface p-6 text-center">
            <span role="img" aria-label="food" className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-3xl">🍱</span>
            <p className="tag mt-3 text-muted">Food allowance</p>
            <p className="font-display text-2xl font-bold text-brand">{`RM ${meal}`}</p>
            <p className="mt-1 text-sm text-muted">per pax</p>
          </div>
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-brand/25 bg-surface p-6 text-center">
            <span role="img" aria-label="car" className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-3xl">🚗</span>
            <p className="tag mt-3 text-muted">Car allowance</p>
            <p className="font-display text-2xl font-bold text-brand">{rm(driverAmount)}</p>
            <p className="mt-1 text-sm text-muted">per qualifying car</p>
          </div>
        </section>
        </Reveal>

        {scheduleDay.length > 0 && (
          <Reveal delay={0.15}>
          <section className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="tag text-brand">{scheduleLabel}</p>
              <Link href="/itinerary" className="text-sm font-medium text-brand hover:underline">View full →</Link>
            </div>
            <ol className="mt-4 space-y-2.5">
              {scheduleDay.slice(0, 6).map((it, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-24 shrink-0 font-mono text-xs text-brand">{it.time || "—"}</span>
                  <span className="font-medium">{it.activity}</span>
                </li>
              ))}
            </ol>
          </section>
          </Reveal>
        )}

        {emergency.length > 0 && (
          <Reveal delay={0.2}>
          <section>
            <p className="tag text-muted">Need help? Call a contact person</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {emergency.map((c, i) => (
                <a key={i} href={telHref(c.phone)} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand"><PhoneIcon /></span>
                  <span className="flex-1"><span className="block font-medium">{c.name}</span><span className="tag text-muted">{c.role}</span></span>
                  <span className="font-mono text-sm text-brand">{phoneDisplay(c.phone)}</span>
                </a>
              ))}
            </div>
          </section>
          </Reveal>
        )}

        <Reveal delay={0.25}>
        <section>
          <p className="tag text-muted">Jump to</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {quick.map((n) => (
              <Link key={n.href} href={n.href} className="group rounded-2xl border border-line bg-surface p-4 transition hover:border-brand hover:shadow-sm">
                <span className="tag text-muted/60">{n.code}</span>
                <p className="mt-2 font-display text-lg font-medium tracking-tight group-hover:text-brand">{n.label}</p>
              </Link>
            ))}
          </div>
        </section>
        </Reveal>
      </div>
    </>
  );
}
