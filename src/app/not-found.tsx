import Link from "next/link";
import { getSettings } from "@/lib/sheets";

export default async function NotFound() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const img = s.not_found_pixel_image || "";
  return (
    <div className="mx-auto max-w-content px-4 py-24 text-center">
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="No results found" className="mx-auto mb-4 h-auto w-44 object-contain" />
      )}
      <p className="tag text-brand">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">That trail doesn&apos;t lead anywhere.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white">Back to Overview</Link>
    </div>
  );
}
