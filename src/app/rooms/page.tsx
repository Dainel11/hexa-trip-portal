import { getRooms, getRoomTypes, getSettings } from "@/lib/sheets";
import { roomLabel } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";

export const revalidate = 60;
export const metadata = { title: "Room List" };

export default async function Page() {
  const [rooms, roomTypes, settings] = await Promise.all([getRooms(), getRoomTypes(), getSettings()]);
  if (!rooms.length)
    return (<><PageHeader eyebrow="02 · Stay" title="Room List" />
      <div className="mx-auto max-w-content px-4 py-8"><EmptyState title="No rooms yet" hint="Fill the Rooms tab to populate this list." /></div></>);

  // Resolve the full room-type label from config (FS → Family Studio, 3R → 3 Bedroom Condo)
  const items = rooms.map((r) => ({ ...r, roomTypeLabel: roomLabel(r.roomType, r.roomId, roomTypes) }));

  return (
    <>
      <PageHeader eyebrow="02 · Stay" title="Room List"
        intro="Search your name to find your room." />
      <div className="mx-auto max-w-content px-4 py-8">
        <SearchableList
          items={items as unknown as Record<string, string>[]}
          fields={["name", "roomId", "roomTypeLabel"]}
          placeholder="Search your name or room (e.g. FS 1)…"
          variant="rooms"
          banners={[
            { src: settings.room_fs_image || "", label: "Family Studio" },
            { src: settings.room_3r_image || "", label: "3 Bedroom Condo" },
          ]}
        />
      </div>
    </>
  );
}
