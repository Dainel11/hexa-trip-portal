import { getRooms } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { Pill } from "@/components/Card";
import { groupBy } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Room List" };

export default async function Page() {
  const rooms = await getRooms();
  if (!rooms.length)
    return (<><PageHeader eyebrow="02 · Stay" title="Room List" />
      <div className="mx-auto max-w-content px-4 py-8"><EmptyState title="No rooms yet" hint="Fill the Rooms tab to populate this list." /></div></>);

  return (
    <>
      <PageHeader eyebrow="02 · Stay" title="Room List"
        intro="Search your name to find your room and room leader." />
      <div className="mx-auto max-w-content px-4 py-8">
        <SearchableList
          items={rooms as unknown as Record<string, string>[]}
          fields={["name", "roomId", "roomLeader"]}
          placeholder="Search your name or room (e.g. FS 1)…"
          render={(filtered) => {
            const byRoom = groupBy(filtered, (r) => r["roomId"]);
            return (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...byRoom.entries()].map(([room, occ]) => {
                  const leader = occ.find((o) => o["roomLeader"])?.["roomLeader"];
                  return (
                    <div key={room} className="rounded-2xl border border-line bg-surface p-5">
                      <div className="flex items-center justify-between">
                        <Pill tone="brand">Room · {room}</Pill>
                        {occ[0]?.["roomType"] && <span className="tag text-muted">{occ[0]["roomType"]}</span>}
                      </div>
                      {leader && (
                        <p className="mt-3 text-sm"><span className="tag text-amber">Leader</span>{" "}
                          <span className="font-medium">{leader}</span></p>
                      )}
                      <ul className="mt-3 space-y-1.5">
                        {occ.map((o, i) => (
                          <li key={i} className="flex items-center justify-between border-t border-line/70 pt-1.5 first:border-0 first:pt-0">
                            <span className={o["name"] === leader ? "font-medium" : ""}>{o["name"]}</span>
                            {o["costType"] && <span className="tag text-muted">{o["costType"]}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
