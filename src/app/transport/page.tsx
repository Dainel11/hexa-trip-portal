import { getTransport } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { Pill } from "@/components/Card";
import { groupBy } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Transport" };

export default async function Page() {
  const rows = await getTransport();
  if (!rows.length)
    return (<><PageHeader eyebrow="03 · Getting there" title="Transport" />
      <div className="mx-auto max-w-content px-4 py-8"><EmptyState title="No transport yet" hint="Fill the Transport tab to populate this list." /></div></>);

  return (
    <>
      <PageHeader eyebrow="03 · Getting there" title="Transport"
        intro="Search your name to find your bus, van or car." />
      <div className="mx-auto max-w-content px-4 py-8">
        <SearchableList
          items={rows as unknown as Record<string, string>[]}
          fields={["name", "vehicle", "plate", "pickupPoint"]}
          placeholder="Search your name or vehicle (e.g. BUS A)…"
          render={(filtered) => {
            const byVeh = groupBy(filtered, (r) => r["vehicle"]);
            return (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...byVeh.entries()].map(([veh, ppl]) => (
                  <div key={veh} className="rounded-2xl border border-line bg-surface p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="water">🚍 {veh}</Pill>
                      {ppl[0]?.["plate"] && <span className="tag text-muted">{ppl[0]["plate"]}</span>}
                      <span className="ml-auto tag text-muted">{ppl.length} pax</span>
                    </div>
                    {ppl[0]?.["pickupPoint"] && (
                      <p className="mt-2 text-sm text-muted">📍 {ppl[0]["pickupPoint"]}
                        {ppl[0]["pickupTime"] && ` · ${ppl[0]["pickupTime"]}`}</p>
                    )}
                    <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {ppl.map((p, i) => <li key={i} className="text-sm">{p["name"]}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
