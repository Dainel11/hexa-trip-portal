import { getTransport, getAllowance } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { rm } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Transport" };

export default async function Page() {
  const [rows, allow] = await Promise.all([getTransport(), getAllowance()]);
  const driver = allow.find((a) => /driver/i.test(a.item));

  return (
    <>
      <PageHeader eyebrow="03 · Getting there" title="Transport"
        intro="Search your name to find your bus, van or car." />
      <div className="mx-auto max-w-content px-4 py-8">
        {driver && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-4">
            <span aria-hidden className="text-xl">🚗</span>
            <p className="text-sm">
              <span className="font-semibold">Driver Allowance — {rm(driver.amount)}.</span>{" "}
              {driver.notes || "For appointed drivers bringing passengers."}
            </p>
          </div>
        )}
        {!rows.length ? (
          <EmptyState title="No transport yet" hint="Fill the Transport tab to populate this list." />
        ) : (
          <SearchableList items={rows as unknown as Record<string, string>[]}
            fields={["name", "vehicle", "plate", "pickupPoint"]}
            placeholder="Search your name or vehicle (e.g. BUS A)…" variant="transport" />
        )}
      </div>
    </>
  );
}
