import { getTshirts, getSettings, getDressCode } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";
import SafariShopMenu, { type SafariShopItem } from "@/components/SafariShopMenu";
import { ShirtIcon } from "@/components/icons";

export const revalidate = 60;
export const metadata = { title: "Shirts & Dress Code" };

function isGala(text: string) {
  const t = text.toLowerCase();
  return t.includes("dinner") || t.includes("gala") || t.includes("night");
}

// PEMBETULAN LOGIK SAFARI DINNER KETAT:
// Kod hanya akan mengembalikan true jika mengandungi perkataan 'safari' DAN 'dinner' atau 'night'
function isSafariDinnerCard(day: string, theme: string) {
  const combined = `${day} ${theme}`.toLowerCase();
  return combined.includes("safari") && (combined.includes("dinner") || combined.includes("night"));
}

export default async function Page() {
  const [rows, settings, dress] = await Promise.all([getTshirts(), getSettings(), getDressCode()]);

  const fallback = [settings.safari_shirt_image, settings.waterworld_shirt_image, settings.gala_image];
  const confirmed = (v: string) => !["false", "no", "0"].includes((v || "").toLowerCase());
  const cards = dress.map((d, i) => ({ ...d, img: confirmed(d.confirmed) ? (d.image || fallback[i] || "") : "" }));
  
  // Neutral gala inspirations (no Staff/Management split); images come from Config.
  // Shop URLs (executive request): staff can jump straight to the apparel store.
  const galaPair = [
    { url: settings.gala_image_a || settings.gala_management_image, label: "Inspiration A", shopUrl: settings.gala_inspiration_a_shop_url || "" },
    { url: settings.gala_image_b || settings.gala_staff_image, label: "Inspiration B", shopUrl: settings.gala_inspiration_b_shop_url || "" },
  ].filter((g) => g.url);

  // Safari shopping hub (Batch C-5): 4 category links from Config.
  // Empty keys are dropped here; if all 4 are blank the CTA never renders.
  const safariShops: SafariShopItem[] = [
    { label: "🤠 Set Baju Explorer / Ranger", url: settings.safari_shop_url_1 || "" },
    { label: "🐯 Cekal Telinga & Ekor Haiwan", url: settings.safari_shop_url_2 || "" },
    { label: "🐗 Topeng Haiwan 3D", url: settings.safari_shop_url_3 || "" },
    { label: "🦁 Baju Jumpsuit Onesies Haiwan", url: settings.safari_shop_url_4 || "" },
  ].filter((s) => s.url);

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
                
                // PEMBETULAN PENAPIS BUTANG SAFARI SHOPPING HUB:
                // Butang kini disekat hanya terbit di kad Safari Night Dinner (Kad Ketiga sahaja)
                const safari = isSafariDinnerCard(c.day || "", c.theme || "") && safariShops.length > 0;
                
                return (
                  <article key={i} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                    {gala ? (
                      /* Mobile: tactile swipe deck (snap-x) with safe interactive indicator bounds */
                      <div className="relative flex flex-col bg-gradient-to-b from-brand-soft/30 to-surface p-2">
                        
                        {/* VISUAL CUE: Petunjuk swipe lembut hanya kelihatan di skrin telefon (md:hidden) */}
                        <div className="mb-2 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold tracking-wide text-brand/80 animate-pulse md:hidden">
                          <span>↔️ Leret (Swipe) kiri/kanan untuk Inspiration B</span>
                        </div>

                        <div className="flex h-80 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth no-scrollbar md:grid md:grid-cols-2 md:gap-1 md:overflow-visible">
                          {galaPair.map((g) => (
                            <figure key={g.label} className="flex w-full shrink-0 snap-center flex-col md:w-auto md:min-w-0">
                              <SmartImage src={g.url} alt={g.label} className="min-h-0 w-full flex-1 rounded-lg object-contain" />
                              <figcaption className="tag pt-1 text-center text-muted">{g.label}</figcaption>
                              {g.shopUrl && (
                                <a href={g.shopUrl} target="_blank" rel="noopener noreferrer"
                                  className="mx-auto mt-1.5 inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                                  🛒 Beli Baju Di Sini
                                </a>
                              )}
                            </figure>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* h-80 — symmetric with the Gala deck block height. */
                      <div className="flex h-80 items-center justify-center bg-gradient-to-b from-brand-soft/30 to-surface p-3">
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
                      {c.teeColour && <p className="tag mt-1 text-muted">Colour: {c.teeColour}</p>}
                      {c.description && <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.description}</p>}
                      {safari && <SafariShopMenu items={safariShops} />}
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
              <SearchableList items={rows as unknown as Record<string, string>[]} fields={["name", "staff"]}
                placeholder="Search any name — see the whole family's sizes…" variant="shirtFamily" notFoundImg={settings.not_found_pixel_image || ""} />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
