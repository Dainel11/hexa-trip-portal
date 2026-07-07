import { getTransport, getSettings, getCarAllowances } from "@/lib/sheets";
import { numSetting, DRIVER_ALLOWANCE_DEFAULT, DRIVER_MIN_PAX_DEFAULT } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { rm } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Transport" };

/**
 * Batch C-5 Restructured Layout:
 *  - Removed restrictiveness of overflow-hidden layout wrappers.
 *  - Enforced a higher absolute-inset scaling matrix to explode the retro pixel art dimensions cleanly.
 *  - Maintained safe structural boundary configurations for outer background cards.
 */
function Metric({
  label,
  stats,
  image,
}: {
  label: string;
  stats: [string, number][];
  image?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      {/* Numbers stay locked at the top — never hidden by the animation. */}
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

      {/* RE-ARCHITECTED IMAGE BLOCK: Using relative container with overflow-visible to maximize image dimensions */}
      <div className="relative mt-2 flex min-h-[200px] w-full items-center justify-center overflow-visible bg-transparent sm:min-h-[240px]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`${label} vehicle`}
            loading="eager"
            fetchPriority="high"
            className="animate-van-shake absolute inset-0 mx-auto h-full w-full object-contain p-0 origin-center scale-150 transition-transform duration-300 sm:scale-165"
          />
        ) : (
          <div className="grid h-48 w-full place-items-center rounded-xl border border-dashed border-line md:h-56">
            <span className="tag text-muted">Image coming soon</span>
          </div>
        )}
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

  // Vehicle artwork now lives in Google Sheets Config (transparent PNGs) so the
  // ops team can swap it without redeploying. Empty → placeholder tag renders.
  const busImg = settings.transport_bus_image || "";
  const vanImg = settings.transport_van_image || "";
  const carImg = settings.transport_car_image || "";

  const summary = (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Metric label="Buses" image={busImg} stats={[["Buses", count("BUS")], ["Passengers", pax("BUS")]]} />
      <Metric label="Vans" image={vanImg} stats={[["Vans", count("VAN")], ["Passengers", pax("VAN")]]} />
      <Metric label="Cars" image={carImg} stats={[["Cars", count("CAR")], ["Passengers", pax("CAR")]]} />
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
