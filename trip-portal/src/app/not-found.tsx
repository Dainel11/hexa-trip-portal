import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-4 py-24 text-center">
      <p className="tag text-brand">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">That trail doesn't lead anywhere.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white">Back to Overview</Link>
    </div>
  );
}
