import { getPayments } from "@/lib/sheets";
import { SHOW_PAYMENTS } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";

export const revalidate = 60;
export const metadata = { title: "Cost Summary" };

export default async function Page() {
  if (!SHOW_PAYMENTS)
    return (<><PageHeader eyebrow="06 · Money" title="Cost Summary" />
      <div className="mx-auto max-w-content px-4 py-8">
        <EmptyState title="Cost details are private" hint="This section has been turned off for this portal. Please ask a contact person." />
      </div></>);

  const rows = (await getPayments()).filter((r) => r.familyGroup);
  return (
    <>
      <PageHeader eyebrow="06 · Money" title="Cost Summary"
        intro="Berapa perlu dibayar jika bawa keluarga. Cari nama anda untuk lihat jumlah dan bilangan pax." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No cost records yet" /> : (
          <SearchableList items={rows as unknown as Record<string, string>[]}
            fields={["familyGroup"]} placeholder="Search your name…" variant="payment" />
        )}
      </div>
    </>
  );
}
