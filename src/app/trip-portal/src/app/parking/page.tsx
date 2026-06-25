import { getParking } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { Card, Field } from "@/components/Card";

export const revalidate = 60;
export const metadata = { title: "Parking" };

export default async function Page() {
  const rows = await getParking();
  return (
    <>
      <PageHeader eyebrow="12 · Arrive" title="Parking Information"
        intro="Where to park on arrival." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No parking info yet" hint="Fill the Parking tab in the sheet." /> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map((p, i) => (
              <Card key={i}>
                <p className="font-display text-lg font-medium">{p.area}</p>
                <dl className="mt-3 grid grid-cols-2 gap-3">
                  {p.capacity && <Field label="Capacity" value={p.capacity} />}
                </dl>
                {p.notes && <p className="mt-2 text-sm text-muted">{p.notes}</p>}
                {p.mapLink && <a href={p.mapLink} target="_blank" rel="noopener" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">Open in Maps →</a>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
