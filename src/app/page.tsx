import Link from "next/link";
import { getEventInfo, getContacts } from "@/lib/sheets";
import { NAV } from "@/lib/config";
import SmartImage from "@/components/SmartImage";
import Countdown from "@/components/Countdown";
import { Pill } from "@/components/Card";
import { displayPhone, telHref } from "@/lib/format";
import { PhoneIcon } from "@/components/icons";

export const revalidate = 60;

export default async function Home() {
  const [info, contacts] = await Promise.all([getEventInfo(), getContacts()]);
  const dates = [info.startDate, info.endDate].filter(Boolean).join(" – ");
  const quick = NAV.filter((n) => n.href !== "/");
  const emergency = contacts.slice(0, 4);

  return (
    <>
      <section className="contour border-b border-line">
        <div className="mx-auto grid max-w-content gap-6 px-4 py-8 sm:py-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="reveal">
            <p className="tag text-brand">Company Trip · Field Guide</p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              {info.eventName || "Company Trip"}
            </h1>
            {info.tagline && <p className="mt-3 max-w-xl text-muted">{info.tagline}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {info.location && <Pill tone="brand">📍 {info.location}</Pill>}
              {dates && <Pill tone="amber">🗓 {dates}</Pill>}
            </div>
          </div>
          {info.heroImage && (
            <div className="reveal overflow-hidden rounded-2xl border border-line shadow-sm">
              <SmartImage src={info.heroImage} alt={info.eventName} className="h-44 w-full object-cover sm:h-56" />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-10 px-4 py-8">
        {info.startDate && <Countdown date={info.startDate} />}

        {emergency.length > 0 && (
          <section>
            <p className="tag text-muted">Need help? Call a contact person</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {emergency.map((c, i) => (
                <a key={i} href={telHref(c.phone)} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand"><PhoneIcon /></span>
                  <span className="flex-1">
                    <span className="block font-medium">{c.name}</span>
                    <span className="tag text-muted">{c.role}</span>
                  </span>
                  <span className="font-mono text-sm text-brand">{displayPhone(c.phone)}</span>
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
