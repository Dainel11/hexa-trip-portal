import { getRooms } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";

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
          variant="rooms"
        />
      </div>
    </>
  );
}
