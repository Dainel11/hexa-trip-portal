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
        intro="Jadual penuh perjalanan. Tekan print untuk salinan kertas.">
        <PrintButton />
      </PageHeader>

      <div className="print-area mx-auto max-w-content px-4 py-8">
        {poster && (
          <figure className="mb-10 overflow-hidden rounded-2xl border border-line bg-surface">
            <SmartImage src={poster} alt="Itinerary poster" className="w-full object-contain" />
          </figure>
        )}

        {items.length === 0 && !poster ? (
          <EmptyState title="No itinerary yet" hint="HR can fill the Itinerary tab, or add an itinerary_poster image in EventInfo." />
        ) : (
          [...days.entries()].map(([day, rows]) => (
            <section key={day} className="mb-10">
              <h2 className="font-display text-2xl font-semibold tracking-tight">{day}</h2>
              <ol className="mt-4 border-l-2 border-line">
                {rows.map((r, i) => (
                  <li key={i} className="relative pl-6 pb-6 last:pb-0">
                    <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-brand" />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="tag text-brand">{r.time || "—"}</span>
                      <span className="font-medium">{r.activity}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted">
                      {r.venue && <span>📍 {r.venue}</span>}
                      {r.meal && <span>🍽 {r.meal}</span>}
                      {r.dressCode && <Pill tone="amber">{r.dressCode}</Pill>}
                      {r.pic && <span>· PIC: {r.pic}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))
        )}
      </div>
    </>
  );
}
