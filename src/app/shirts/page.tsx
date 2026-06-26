import { getTshirts, getSettings, getDressCode } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";
import { ShirtIcon } from "@/components/icons";

export const revalidate = 60;
export const metadata = { title: "Shirts & Dress Code" };

function isGala(text: string) {
  const t = text.toLowerCase();
  return t.includes("dinner") || t.includes("gala") || t.includes("night");
}

export default async function Page() {
  const [rows, settings, dress] = await Promise.all([getTshirts(), getSettings(), getDressCode()]);

  const fallback = [settings.safari_shirt_image, settings.waterworld_shirt_image, settings.gala_image];
  const cards = dress.map((d, i) => ({ ...d, img: d.image || fallback[i] || "" }));
  const galaPair = [
    { url: settings.gala_management_image, label: "Management" },
    { url: settings.gala_staff_image, label: "Staff" },
  ].filter((g) => g.url);

  return (
    <>
      <PageHeader eyebrow="04 · Gear" title="Shirts & Dress Code"
        intro="Tema pakaian setiap hari, dan cari saiz baju anda." />

      <div className="mx-auto max-w-content space-y-12 px-4 py-8">
        {cards.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Dress guide</h2>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
              {cards.map((c, i) => {
                const gala = isGala(`${c.day} ${c.theme}`) && galaPair.length > 0;
                return (
                  <article key={i} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                    {gala ? (
                      <div className="grid h-72 grid-cols-2 gap-1 bg-gradient-to-b from-brand-soft/30 to-surface p-2">
                        {galaPair.map((g) => (
                          <figure key={g.label} className="flex min-h-0 flex-col">
                            <SmartImage src={g.url} alt={g.label} className="min-h-0 w-full flex-1 rounded-lg object-cover" />
                            <figcaption className="tag pt-1 text-center text-muted">{g.label}</figcaption>
                          </figure>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-72 items-center justify-center bg-gradient-to-b from-brand-soft/30 to-surface p-3">
                        {c.img ? (
                          <SmartImage src={c.img} alt={c.theme} className="h-full w-full object-contain" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-brand/50">
                            <ShirtIcon className="h-12 w-12" />
                            <span className="tag">Image coming soon</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <span className="tag inline-flex w-fit items-center rounded-full bg-amber/15 px-2.5 py-1 text-amber">{c.day}</span>
                      <h3 className="mt-2 font-display text-lg font-semibold">{c.theme}</h3>
                      {c.description && <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.description}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Find your shirt size</h2>
          <p className="mt-1 text-sm text-muted">Taip nama anda untuk lihat saiz.</p>
          <div className="mt-4">
            {!rows.length ? <EmptyState title="No sizes yet" hint="Fill the TShirts tab." /> : (
              <SearchableList items={rows as unknown as Record<string, string>[]} fields={["name"]}
                placeholder="Search your name…" variant="tshirt" requireSearch />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
