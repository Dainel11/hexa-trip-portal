import { getAllowance } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { rm } from "@/lib/format";
import { WalletIcon } from "@/components/icons";

export const revalidate = 60;
export const metadata = { title: "Staff Allowance" };

export default async function Page() {
  const rows = (await getAllowance()).filter((a) => !/driver/i.test(a.item));
  return (
    <>
      <PageHeader eyebrow="06 · Money" title="Staff Allowance"
        intro="What each staff member receives for the trip. (Driver allowance is shown on the Transport page.)" />
      <div className="mx-auto max-w-content px-4 py-10">
        {!rows.length ? <EmptyState title="No allowance details yet" hint="Fill the Allowance tab in the sheet." /> : (
          <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
            {rows.map((r, i) => (
              <div key={i} className="flex flex-col items-center rounded-2xl border border-line bg-surface p-8 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand"><WalletIcon className="h-7 w-7" /></span>
                <p className="mt-4 tag text-muted">{r.item}</p>
                <p className="mt-1 font-display text-4xl font-semibold text-brand">{rm(r.amount)}</p>
                {r.notes && <p className="mt-2 text-sm text-muted">{r.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
