import { getLocations, getRestaurants, getParking } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";
import MapEmbed from "@/components/MapEmbed";
import { Pill } from "@/components/Card";

export const revalidate = 60;
export const metadata = { title: "Locations" };

export default async function Page() {
  const [locations, restaurants, parking] = await Promise.all([getLocations(), getRestaurants(), getParking()]);
  const empty = !locations.length && !restaurants.length && !parking.length;

  return (
    <>
      <PageHeader eyebrow="05 · Places" title="Locations"
        intro="Tempat penting, tempat makan, dan parking — semua di satu tempat. Tekan peta untuk arah." />
      <div className="mx-auto max-w-content space-y-12 px-4 py-8">
        {empty && <EmptyState title="No places yet" hint="Fill the Locations, Restaurants or Parking tabs." />}

        {locations.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Key places</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {locations.map((l, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface">
                  {l.image && <SmartImage src={l.image} alt={l.name} className="aspect-[16/9] w-full object-cover" />}
                  <MapEmbed query={`${l.name} ${l.address}`.trim()} />
                  <div className="p-5">
                    <p className="font-display text-lg font-semibold">{l.name}</p>
                    {l.address && <p className="text-sm text-muted">{l.address}</p>}
                    {l.notes && <p className="mt-2 text-sm">{l.notes}</p>}
                    {l.mapLink && <a href={l.mapLink} target="_blank" rel="noopener" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">Open in Google Maps →</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {restaurants.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Where to eat</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                  {r.image && <SmartImage src={r.image} alt={r.name} className="h-32 w-full object-cover" />}
                  <div className="flex flex-1 flex-col p-4">
                    {r.cuisine && <Pill tone="brand">{r.cuisine}</Pill>}
                    <p className="mt-2 font-display text-base font-semibold">{r.name}</p>
                    {r.location && <p className="text-sm text-muted">📍 {r.location}</p>}
                    {r.notes && <p className="mt-1 text-sm">{r.notes}</p>}
                    {r.mapLink && r.mapLink !== "--" && <a href={r.mapLink} target="_blank" rel="noopener" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">Map →</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {parking.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Parking</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {parking.map((p, i) => (
                <div key={i} className="rounded-2xl border border-line bg-surface p-5">
                  <p className="font-display text-lg font-semibold">{p.area}</p>
                  {p.capacity && <p className="tag mt-1 text-muted">Capacity: {p.capacity}</p>}
                  {p.notes && <p className="mt-2 text-sm text-muted">{p.notes}</p>}
                  {p.mapLink && <a href={p.mapLink} target="_blank" rel="noopener" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">Open in Maps →</a>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
