import { getTshirts, getSettings } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import SmartImage from "@/components/SmartImage";

export const revalidate = 60;
export const metadata = { title: "T-Shirt Size" };

export default async function Page() {
  const [rows, settings] = await Promise.all([getTshirts(), getSettings()]);
  const safari = settings.safari_shirt_image;
  const water = settings.waterworld_shirt_image;

  return (
    <>
      <PageHeader eyebrow="04 · Gear" title="T-Shirt Size"
        intro="Lihat reka bentuk baju, dan cari nama anda untuk sahkan saiz sebelum kutipan." />
      <div className="mx-auto max-w-content px-4 py-8">
        {(safari || water) && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {safari && (
              <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
                <SmartImage src={safari} alt="Safari shirt" className="aspect-square w-full object-cover" />
                <figcaption className="tag px-4 py-2 text-amber">Safari Shirt</figcaption>
              </figure>
            )}
            {water && (
              <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
                <SmartImage src={water} alt="Water World shirt" className="aspect-square w-full object-cover" />
                <figcaption className="tag px-4 py-2 text-water">Water World Shirt</figcaption>
              </figure>
            )}
          </div>
        )}
        {!rows.length ? (
          <EmptyState title="No sizes yet" hint="Fill the TShirts tab to populate this list." />
        ) : (
          <SearchableList
            items={rows as unknown as Record<string, string>[]}
            fields={["name"]}
            placeholder="Search your name…"
            variant="tshirt"
          />
        )}
      </div>
    </>
  );
}
