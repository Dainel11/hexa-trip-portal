import Link from "next/link";
import { getEventInfo, getContacts, getItinerary, getSettings, getCarAllowances, getDirectory } from "@/lib/sheets";
import { NAV, numSetting, DRIVER_ALLOWANCE_DEFAULT, DRIVER_MIN_PAX_DEFAULT } from "@/lib/config";
import SmartImage from "@/components/SmartImage";
import Countdown from "@/components/Countdown";
import GlobalSearch from "@/components/GlobalSearch";
import { Pill } from "@/components/Card";
import { phoneDisplay, telHref, groupBy, rm } from "@/lib/format";
import { PhoneIcon, CarIcon } from "@/components/icons";

export const revalidate = 60;

function dayKey(d: string): string {
  const t = Date.parse(d.replace(/^[A-Za-z]+,\s*/, ""));
  return isNaN(t) ? "" : new Date(t).toDateString();
}

export default async function Home() {
  const [info, contacts, itinerary, settings, directory] = await Promise.all([getEventInfo(), getContacts(), getItinerary(), getSettings(), getDirectory()]);
  const driverMin = numSetting(settings, "driver_min_pax", DRIVER_MIN_PAX_DEFAULT);
  const driverAmount = numSetting(settings, "driver_allowance_amount", DRIVER_ALLOWANCE_DEFAULT);
  const allow = await getCarAllowances(driverMin);
  const eligibleCars = [...allow.values()].filter((a) => a.eligible).length;
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
        <GlobalSearch entries={directory} />

        {info.startDate && <Countdown date={info.startDate} />}

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-2xl border border-line bg-surface p-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand"><CarIcon className="h-6 w-6" /></span>
            <p className="tag mt-3 text-muted">Car allowance</p>
            <p className="font-display text-2xl font-bold">{rm(driverAmount)}</p>
            <p className="mt-1 text-sm text-muted">per qualifying car ({driverMin}+ people incl. driver)</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-6 text-center">
            <p className="font-display text-4xl font-bold text-brand">{eligibleCars}</p>
            <p className="mt-1 tag text-muted">cars currently qualify</p>
          </div>
        </section>

        {scheduleDay.length > 0 && (
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
        )}

        {emergency.length > 0 && (
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
        )}

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
      </div>
    </>
  );
}
