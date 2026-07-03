import { getTransport, getSettings } from "@/lib/sheets";
import { numSetting, DRIVER_ALLOWANCE_DEFAULT, DRIVER_MIN_PAX_DEFAULT } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { rm } from "@/lib/format";
import { BusIcon, VanIcon, CarIcon } from "@/components/icons";

export const revalidate = 60;
export const metadata = { title: "Transport" };

function Metric({ icon, label, stats }: { icon: React.ReactNode; label: string; stats: [string, number][] }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-surface p-6 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-water/15 text-water">{icon}</span>
      <p className="mt-3 font-display text-lg font-semibold">{label}</p>
      <div className="mt-2 flex justify-center gap-6">
        {stats.map(([k, v]) => (
          <div key={k}>
            <p className="font-display text-2xl font-bold text-brand">{v}</p>
            <p className="tag text-muted">{k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Page() {
  const [rows, settings] = await Promise.all([getTransport(), getSettings()]);
  const amount = numSetting(settings, "driver_allowance_amount", DRIVER_ALLOWANCE_DEFAULT);
  const minPax = numSetting(settings, "driver_min_pax", DRIVER_MIN_PAX_DEFAULT);
  const parkingNote = settings.parking_note || "";
  const safeRows = rows || [];

  // Live metrics grouped by vehicle
  const byVeh = new Map<string, { type: string; pax: number }>();
  for (const r of safeRows) {
    const g = byVeh.get(r.vehicleId) || { type: (r.vehicleType || "CAR").toUpperCase(), pax: 0 };
    g.pax += 1; byVeh.set(r.vehicleId, g);
  }
  const groups = [...byVeh.values()];
  const count = (t: string) => groups.filter((g) => g.type === t).length;
  const pax = (t: string) => groups.filter((g) => g.type === t).reduce((s, g) => s + g.pax, 0);

  const summary = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Metric icon={<BusIcon className="h-8 w-8" />} label="Buses"
        stats={[["Buses", count("BUS")], ["Passengers", pax("BUS")]]} />
      <Metric icon={<VanIcon className="h-8 w-8" />} label="Vans"
        stats={[["Vans", count("VAN")], ["Passengers", pax("VAN")]]} />
      <Metric icon={<CarIcon className="h-8 w-8" />} label="Cars"
        stats={[["Cars", count("CAR")]]} />
    </div>
  );

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

        {parkingNote && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
            <span aria-hidden className="text-xl">🅿️</span>
            <p className="text-sm text-muted">{parkingNote}</p>
          </div>
        )}

        {!safeRows.length ? (
          <EmptyState title="No transport yet" hint="Fill the Employees tab (vehicle_id) to populate this list." />
        ) : (
          <SearchableList
            items={safeRows.map((r) => ({
              name: r.name, vehicleId: r.vehicleId, vehicleType: r.vehicleType,
              plate: r.plate, isDriver: r.isDriver ? "1" : "", pic: r.pic,
            }))}
            fields={["name", "vehicleId", "plate"]}
            placeholder="Search your name…" variant="transport" driverMinPax={minPax}
            summary={summary} />
        )}
      </div>
    </>
  );
}
