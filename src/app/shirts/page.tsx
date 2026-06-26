import { getTshirts, getSettings, getDressCode } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";
import { Pill } from "@/components/Card";

export const revalidate = 60;
export const metadata = { title: "Shirts & Dress Code" };

export default async function Page() {
  const [rows, settings, dress] = await Promise.all([getTshirts(), getSettings(), getDressCode()]);
  const shirtImgs = [
    { url: settings.safari_shirt_image, label: "Safari Shirt", tone: "amber" as const },
    { url: settings.waterworld_shirt_image, label: "Water World Shirt", tone: "water" as const },
  ].filter((s) => s.url);

  return (
    <>
      <PageHeader eyebrow="04 · Gear" title="Shirts & Dress Code"
        intro="Lihat reka bentuk baju, cari saiz anda, dan tema pakaian setiap hari." />
      <div className="mx-auto max-w-content space-y-12 px-4 py-8">

        {shirtImgs.length > 0 && (
          <section className="grid gap-4 sm:grid-cols-2">
            {shirtImgs.map((s) => (
              <figure key={s.label} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <SmartImage src={s.url} alt={s.label} className="aspect-square w-full object-cover" />
                <figcaption className={`tag px-4 py-2 ${s.tone === "amber" ? "text-amber" : "text-water"}`}>{s.label}</figcaption>
              </figure>
            ))}
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Find your size</h2>
          <div className="mt-4">
            {!rows.length ? <EmptyState title="No sizes yet" hint="Fill the TShirts tab." /> : (
              <SearchableList items={rows as unknown as Record<string, string>[]} fields={["name"]}
                placeholder="Search your name…" variant="tshirt" />
            )}
          </div>
        </section>

        {dress.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Dress guide</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dress.map((d, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface">
                  {d.image && <SmartImage src={d.image} alt={d.theme} className="aspect-[4/3] w-full object-cover" />}
                  <div className="p-5">
                    <Pill tone="amber">{d.day}</Pill>
                    <p className="mt-2 font-display text-lg font-semibold">{d.theme}</p>
                    {d.description && <p className="mt-1 text-sm text-muted">{d.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
