import { getTransport, getSettings, getCarAllowances } from "@/lib/sheets";
import { numSetting, DRIVER_ALLOWANCE_DEFAULT, DRIVER_MIN_PAX_DEFAULT } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import PixelVehicle from "@/components/PixelVehicle";
import { rm } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Transport" };

function Metric({ label, stats, motion }: { label: string; stats: [string, number][]; motion: "bus" | "van" | "car" }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-5 ${motion === "car" ? "speed-lane group cursor-pointer" : ""}`}>
      {/* Metric numbers stay anchored at the top — never hidden by the animation */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-display text-base font-semibold">{label}</span>
        <span className="flex items-center gap-4">
          {stats.map(([k, v]) => (
            <span key={k} className="text-right">
              <b className="block font-display text-xl font-bold leading-none text-brand">{v}</b>
              <span className="tag text-muted">{k}</span>
            </span>
          ))}
        </span>
      </div>
      <div className="road-strip flex h-16 w-full items-center justify-center">
        <span aria-hidden className="road-edge top" />
        <span aria-hidden className="road-lane" />
        <span aria-hidden className="road-edge bottom" />
        {motion === "bus" && (
          <span aria-hidden className="pointer-events-none absolute bottom-3 left-6 flex gap-1">
            <span className="board-fig h-2 w-2 rounded-[1px] bg-amber" style={{ animationDelay: "0s" }} />
            <span className="board-fig h-2 w-2 rounded-[1px] bg-water" style={{ animationDelay: "0.7s" }} />
            <span className="board-fig h-2 w-2 rounded-[1px] bg-brand-soft" style={{ animationDelay: "1.4s" }} />
          </span>
        )}
        <PixelVehicle type={motion}
          className={`relative z-10 drop-shadow-md ${motion === "van" ? "animate-van-idle" : motion === "bus" ? "animate-bus-idle" : "speed-car"}`} />
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
      <Metric label="Buses" motion="bus" stats={[["Buses", count("BUS")], ["Passengers", pax("BUS")]]} />
      <Metric label="Vans" motion="van" stats={[["Vans", count("VAN")], ["Passengers", pax("VAN")]]} />
      <Metric label="Cars" motion="car" stats={[["Cars", count("CAR")]]} />
    </div>
  );

  return (
    <>
      <PageHeader eyebrow="03 · Getting there" title="Transport"
        intro="Search your name to find your bus, van or car." />
      <div className="mx-auto max-w-content px-4 py-8">
        <div className="mb-6 rounded-2xl bg-brand p-5 text-center text-white shadow-sm" role="alert">
          <p className="flex items-center justify-center gap-2 font-display text-lg font-bold sm:text-xl">
            <span role="img" aria-label="coin" className="text-2xl">🪙</span> Driver allowance — {rm(amount)}
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
            summary={summary} notFoundImg={settings.not_found_pixel_image || ""} />
        )}
      </div>
    </>
  );
}
