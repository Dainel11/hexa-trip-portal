import { getTshirts } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { Pill } from "@/components/Card";

export const revalidate = 60;
export const metadata = { title: "T-Shirt Size" };

export default async function Page() {
  const rows = await getTshirts();
  if (!rows.length)
    return (<><PageHeader eyebrow="04 · Gear" title="T-Shirt Size" />
      <div className="mx-auto max-w-content px-4 py-8"><EmptyState title="No sizes yet" hint="Fill the TShirts tab to populate this list." /></div></>);

  return (
    <>
      <PageHeader eyebrow="04 · Gear" title="T-Shirt Size"
        intro="Search your name to confirm your Safari and Water World sizes before collection." />
      <div className="mx-auto max-w-content px-4 py-8">
        <SearchableList
          items={rows as unknown as Record<string, string>[]}
          fields={["name"]}
          placeholder="Search your name…"
          render={(filtered) => (
            <ul className="grid gap-2 sm:grid-cols-2">
              {filtered.map((r, i) => (
                <li key={i} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
                  <span className="font-medium">{r["name"]}</span>
                  <span className="flex gap-2">
                    {r["safariSize"] && <Pill tone="amber">Safari {r["safariSize"]}</Pill>}
                    {r["waterworldSize"] && <Pill tone="water">Water {r["waterworldSize"]}</Pill>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        />
      </div>
    </>
  );
}
