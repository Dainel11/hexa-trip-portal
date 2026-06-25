import { getDressCode } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";
import { Pill } from "@/components/Card";

export const revalidate = 60;
export const metadata = { title: "Dress Code" };

export default async function Page() {
  const rows = await getDressCode();
  return (
    <>
      <PageHeader eyebrow="08 · Style" title="Dress Code"
        intro="What to wear each day so we all match the theme." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No dress code yet" hint="Fill the DressCode tab in the sheet." /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((d, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface">
                {d.image && <SmartImage src={d.image} alt={d.theme} className="aspect-[4/3] w-full object-cover" />}
                <div className="p-5">
                  <Pill tone="amber">{d.day}</Pill>
                  <p className="mt-2 font-display text-xl font-semibold">{d.theme}</p>
                  {d.description && <p className="mt-1 text-sm text-muted">{d.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
