import { getDosDonts } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export const revalidate = 60;
export const metadata = { title: "Do's & Don'ts" };

export default async function Page() {
  const rows = await getDosDonts();
  const dos = rows.filter((r) => /do(?!n)/i.test(r.type));
  const donts = rows.filter((r) => /don'?t|dont/i.test(r.type));
  return (
    <>
      <PageHeader eyebrow="11 · Conduct" title="Do's & Don'ts"
        intro="A few ground rules to keep everyone safe and the trip smooth." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No guidelines yet" hint="Fill the DosDonts tab in the sheet (type column = Do or Don't)." /> : (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-brand/30 bg-brand-soft/40 p-5">
              <p className="font-display text-xl font-semibold text-brand">✓ Do</p>
              <ul className="mt-3 space-y-2">
                {dos.map((d, i) => <li key={i} className="flex gap-2 text-sm"><span className="text-brand">✓</span>{d.item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber/30 bg-amber/10 p-5">
              <p className="font-display text-xl font-semibold text-amber">✕ Don't</p>
              <ul className="mt-3 space-y-2">
                {donts.map((d, i) => <li key={i} className="flex gap-2 text-sm"><span className="text-amber">✕</span>{d.item}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
