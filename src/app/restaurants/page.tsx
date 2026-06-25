import { getRestaurants } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";
import { Pill } from "@/components/Card";

export const revalidate = 60;
export const metadata = { title: "Restaurant Choices" };

export default async function Page() {
  const rows = await getRestaurants();
  return (
    <>
      <PageHeader eyebrow="09 · Eat" title="Restaurant Choices"
        intro="Where to eat in and around the resort." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No restaurants yet" hint="Fill the Restaurants tab in the sheet." /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface">
                {r.image && <SmartImage src={r.image} alt={r.name} className="aspect-[4/3] w-full object-cover" />}
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    {r.cuisine && <Pill tone="brand">{r.cuisine}</Pill>}
                  </div>
                  <p className="mt-2 font-display text-xl font-semibold">{r.name}</p>
                  {r.location && <p className="text-sm text-muted">📍 {r.location}</p>}
                  {r.notes && <p className="mt-2 text-sm">{r.notes}</p>}
                  {r.mapLink && <a href={r.mapLink} target="_blank" rel="noopener" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">Open in Maps →</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
