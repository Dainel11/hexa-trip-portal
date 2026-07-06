import { getItinerary, getEventInfo } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import { Pill } from "@/components/Card";
import { groupBy } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Itinerary" };

const LOCAL_POSTER = "/itinerary-2026.html";

export default async function Page() {
  const [items, info] = await Promise.all([getItinerary(), getEventInfo()]);
  const url = ((info.itinerary_poster as string) || "").trim();

  // Decide how to render the official poster dynamically from the sheet value:
  //  • image URL (.png/.jpg/.jpeg)         → responsive <img>
  //  • .html URL, empty, or a local path   → responsive <iframe> (defaults to the local backup)
  const isImage = /\.(png|jpe?g)(\?.*)?$/i.test(url);
  const isRemoteHtml = /^https?:\/\//i.test(url) && url.toLowerCase().includes(".html");
  const iframeSrc = isRemoteHtml ? url : LOCAL_POSTER;

  const days = groupBy(items || [], (i) => i.date);

  return (
    <>
      <PageHeader eyebrow="01 · Schedule" title="Itinerary"
        intro="Poster di bawah ialah jadual rasmi penuh. Timeline ringkas untuk rujukan pantas.">
        <PrintButton />
      </PageHeader>

      <div className="print-area mx-auto max-w-content px-4 py-8">
        {isImage ? (
          <figure className="mb-10 overflow-hidden rounded-xl border border-line bg-surface shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Hexa Food Trip Poster" className="h-auto w-full rounded-xl object-contain" />
          </figure>
        ) : (
          <div className="mb-10">
            <iframe src={iframeSrc} title="Hexa Food Trip 2026 Itinerary"
              className="h-[85vh] w-full rounded-xl border-0 shadow-md" loading="lazy" />
          </div>
        )}

        {(items || []).length === 0 ? null : (
          <div className="space-y-8">
            <p className="tag text-muted">Quick reference</p>
            {[...days.entries()].map(([day, rows]) => (
              <section key={day}>
                <h2 className="font-display text-xl font-semibold tracking-tight">{day}</h2>
                <ol className="mt-3 divide-y divide-line/70 overflow-hidden rounded-2xl border border-line bg-surface">
                  {(rows || []).map((r, i) => (
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
