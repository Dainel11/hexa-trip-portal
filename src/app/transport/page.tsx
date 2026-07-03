import { getTransport, getSettings, getCarAllowances } from "@/lib/sheets";
import { numSetting, DRIVER_ALLOWANCE_DEFAULT, DRIVER_MIN_PAX_DEFAULT } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { rm } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Transport" };

function Metric({ emoji, label, stats, motion }: { emoji: string; label: string; stats: [string, number][]; motion: "bus" | "van" | "car" }) {
  return (
    <div className={`flex flex-col items-center rounded-2xl border border-line bg-surface p-6 text-center ${motion === "car" ? "speed-lane group cursor-pointer" : ""}`}>
      <div className="road-strip flex h-16 w-full items-center justify-center">
        <span aria-hidden className="road-edge top" />
        <span aria-hidden className={`road-lane ${motion === "bus" ? "scroll" : ""}`} />
        <span aria-hidden className="road-edge bottom" />
        <span role="img" aria-label={label} style={{ imageRendering: "pixelated" }}
          className={`relative z-10 text-4xl leading-none drop-shadow-md ${motion === "van" ? "animate-van" : motion === "car" ? "speed-car" : ""}`}>{emoji}</span>
      </div>
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
  const allow = await getCarAllowances(minPax);
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
      <Metric emoji="🚌" label="Buses" motion="bus" stats={[["Buses", count("BUS")], ["Passengers", pax("BUS")]]} />
      <Metric emoji="🚐" label="Vans" motion="van" stats={[["Vans", count("VAN")], ["Passengers", pax("VAN")]]} />
      <Metric emoji="🚗" label="Cars" motion="car" stats={[["Cars", count("CAR")]]} />
    </div>
  );

  return (
    <>
      <PageHeader eyebrow="03 · Getting there" title="Transport"
        intro="Search your name to find your bus, van or car." />
      <div className="mx-auto max-w-content px-4 py-8">
        <div className="mb-6 rounded-2xl bg-brand p-5 text-center text-white shadow-sm" role="alert">
          <p className="flex items-center justify-center gap-2 font-display text-lg font-bold sm:text-xl">
            <span role="img" aria-label="cash" className="text-2xl">💵</span> Driver allowance — {rm(amount)}
          </p>
          {parkingNote && (
            <p className="mx-auto mt-2 flex max-w-xl items-start justify-center gap-2 text-sm leading-relaxed text-white/90">
              <span role="img" aria-label="parking" className="shrink-0 text-lg leading-none">🅿️</span>
              <span>{parkingNote}</span>
            </p>
          )}
        </div>

        {!safeRows.length ? (
          <EmptyState title="No transport yet" hint="Fill the Employees tab (vehicle_id) to populate this list." />
        ) : (
          <SearchableList
            items={safeRows.map((r) => ({
              name: r.name, vehicleId: r.vehicleId, vehicleType: r.vehicleType,
              plate: r.plate, isDriver: r.isDriver ? "1" : "", pic: r.pic,
              eligible: allow.get(r.vehicleId)?.eligible ? "1" : "",
            }))}
            fields={["name", "vehicleId", "plate"]}
            placeholder="Search your name…" variant="transport" driverMinPax={minPax}
            summary={summary} />
        )}
      </div>
    </>
  );
}
