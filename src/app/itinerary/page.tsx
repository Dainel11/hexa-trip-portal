import { getItinerary, getEventInfo } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";
import { Pill } from "@/components/Card";
import { groupBy } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Itinerary" };

export default async function Page() {
  const [items, info] = await Promise.all([getItinerary(), getEventInfo()]);
  const poster = info.itinerary_poster;
  const days = groupBy(items, (i) => i.date);

  return (
    <>
      <PageHeader eyebrow="01 · Schedule" title="Itinerary"
        intro="Poster di bawah ialah jadual rasmi penuh. Timeline ringkas untuk rujukan pantas.">
        <PrintButton />
      </PageHeader>

      <div className="print-area mx-auto max-w-content px-4 py-8">
        {poster && (
          <figure className="mb-10 overflow-hidden rounded-2xl border border-line bg-surface">
            <SmartImage src={poster} alt="Itinerary poster" className="block w-full object-contain" />
          </figure>
        )}

        {items.length === 0 && !poster ? (
          <EmptyState title="No itinerary yet" hint="Fill the Itinerary tab, or add an itinerary_poster image in EventInfo." />
        ) : (
          <div className="space-y-8">
            {items.length > 0 && <p className="tag text-muted">Quick reference</p>}
            {[...days.entries()].map(([day, rows]) => (
              <section key={day}>
                <h2 className="font-display text-xl font-semibold tracking-tight">{day}</h2>
                <ol className="mt-3 divide-y divide-line/70 overflow-hidden rounded-2xl border border-line bg-surface">
                  {rows.map((r, i) => (
                    <li key={i} className="flex gap-3 px-4 py-3">
                      <span className="w-28 shrink-0 font-mono text-xs text-brand">{r.time || "—"}</span>
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">{r.activity}</p>
                        {(r.venue || r.dressCode) && (
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                            {r.venue && <span>📍 {r.venue}</span>}
                            {r.dressCode && <Pill tone="amber">{r.dressCode}</Pill>}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
