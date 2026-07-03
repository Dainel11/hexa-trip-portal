import { getTransport, getSettings } from "@/lib/sheets";
import { numSetting, DRIVER_ALLOWANCE_DEFAULT, DRIVER_MIN_PAX_DEFAULT } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { rm } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Transport" };

export default async function Page() {
  const [rows, settings] = await Promise.all([getTransport(), getSettings()]);
  const amount = numSetting(settings, "driver_allowance_amount", DRIVER_ALLOWANCE_DEFAULT);
  const minPax = numSetting(settings, "driver_min_pax", DRIVER_MIN_PAX_DEFAULT);

  return (
    <>
      <PageHeader eyebrow="03 · Getting there" title="Transport"
        intro="Search your name to find your bus, van or car." />
      <div className="mx-auto max-w-content px-4 py-8">
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-4">
          <span aria-hidden className="text-xl">🚗</span>
          <p className="text-sm">
            <span className="font-semibold">Driver allowance — {rm(amount)}.</span>{" "}
            For a car carrying <span className="font-medium">{minPax} or more people</span> (including the driver).
          </p>
        </div>
        {!rows.length ? (
          <EmptyState title="No transport yet" hint="Fill the Transport tab to populate this list." />
        ) : (
          <SearchableList
            items={rows.map((r) => ({
              name: r.name, vehicleId: r.vehicleId, vehicleType: r.vehicleType,
              plate: r.plate, isDriver: r.isDriver ? "1" : "", pic: r.pic,
            }))}
            fields={["name", "vehicleId", "plate"]}
            placeholder="Search your name…" variant="transport" driverMinPax={minPax} />
        )}
      </div>
    </>
  );
}
