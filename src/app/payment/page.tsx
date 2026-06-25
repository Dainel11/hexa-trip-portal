import { getPayments } from "@/lib/sheets";
import { SHOW_PAYMENTS } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";

export const revalidate = 60;
export const metadata = { title: "Family Payment" };

export default async function Page() {
  if (!SHOW_PAYMENTS)
    return (<><PageHeader eyebrow="05 · Money" title="Family Payment" />
      <div className="mx-auto max-w-content px-4 py-8">
        <EmptyState title="Payment details are private" hint="This section has been turned off for this portal. Please ask a contact person about collection." />
      </div></>);

  const rows = (await getPayments()).filter((r) => r.familyGroup);
  return (
    <>
      <PageHeader eyebrow="05 · Money" title="Family Payment"
        intro="Search your family to see what's collected and what's outstanding. No personal IDs are shown here." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No payment records yet" /> : (
          <SearchableList
            items={rows as unknown as Record<string, string>[]}
            fields={["familyGroup", "status"]}
            placeholder="Search family name…"
            variant="payment"
          />
        )}
      </div>
    </>
  );
}
