import { getLocations } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";

export const revalidate = 60;
export const metadata = { title: "Locations" };

export default async function Page() {
  const rows = await getLocations();
  return (
    <>
      <PageHeader eyebrow="10 · Map" title="Locations"
        intro="Key spots for the trip — tap to open directions." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No locations yet" hint="Fill the Locations tab in the sheet." /> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map((l, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
                {l.image && <SmartImage src={l.image} alt={l.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />}
                <div>
                  <p className="font-display text-lg font-medium">{l.name}</p>
                  {l.address && <p className="text-sm text-muted">{l.address}</p>}
                  {l.notes && <p className="mt-1 text-sm">{l.notes}</p>}
                  {l.mapLink && <a href={l.mapLink} target="_blank" rel="noopener" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">Directions →</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
