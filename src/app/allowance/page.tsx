import { getAllowance } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/Card";
import { rm } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Staff Allowance" };

export default async function Page() {
  const rows = await getAllowance();
  return (
    <>
      <PageHeader eyebrow="06 · Money" title="Staff Allowance"
        intro="What each staff member and driver receives for the trip." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No allowance details yet" hint="Fill the Allowance tab in the sheet." /> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r, i) => (
              <Card key={i}>
                <p className="tag text-muted">{r.item}</p>
                <p className="mt-1 font-display text-3xl font-semibold text-brand">{rm(r.amount)}</p>
                {r.notes && <p className="mt-2 text-sm text-muted">{r.notes}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
