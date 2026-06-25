import { getTransport } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";

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
          variant="transport"
        />
      </div>
    </>
  );
}
