import { getSettings } from "@/lib/sheets";

export default async function Loading() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const img = s.loading_pixel_image || "";
  return (
    <div className="mx-auto flex max-w-content flex-col items-center px-4 py-24 text-center">
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="Loading..." className="mx-auto h-auto w-28 animate-pulse object-contain" />
      ) : (
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-line border-t-brand" />
      )}
      <p className="mt-4 text-sm font-medium text-muted">Loading... Please wait.</p>
    </div>
  );
}
