import { getPayments } from "@/lib/sheets";
import { SHOW_PAYMENTS } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import SearchableList from "@/components/SearchableList";
import EmptyState from "@/components/EmptyState";
import { Pill } from "@/components/Card";
import { rm } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Family Payment" };

function statusTone(s: string): "brand" | "amber" | "muted" {
  const v = s.toLowerCase();
  if (v.includes("paid")) return "brand";
  if (v.includes("partial")) return "amber";
  return "muted";
}

export default async function Page() {
  if (!SHOW_PAYMENTS)
    return (<><PageHeader eyebrow="05 · Money" title="Family Payment" />
      <div className="mx-auto max-w-content px-4 py-8">
        <EmptyState title="Payment details are private" hint="This section has been turned off for this portal. Please ask a contact person about collection." />
      </div></>);

  const rows = (await getPayments()).filter((r) => r.familyGroup);
  return (
    <>
      <PageHeader eyebrow="05 · Money" title="Family Payment"
        intro="Search your family to see what's collected and what's outstanding. No personal IDs are shown here." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No payment records yet" /> : (
          <SearchableList
            items={rows as unknown as Record<string, string>[]}
            fields={["familyGroup", "status"]}
            placeholder="Search family name…"
            render={(filtered) => (
              <div className="overflow-hidden rounded-2xl border border-line">
                <table className="w-full text-sm">
                  <thead className="bg-brand-soft text-left">
                    <tr className="tag text-brand">
                      <th className="px-4 py-3">Family</th>
                      <th className="px-4 py-3 text-right">Paid</th>
                      <th className="px-4 py-3 text-right">Balance</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={i} className="border-t border-line bg-surface">
                        <td className="px-4 py-3 font-medium">{r["familyGroup"]}</td>
                        <td className="px-4 py-3 text-right">{rm(r["amountPaid"])}</td>
                        <td className="px-4 py-3 text-right">{rm(r["balance"])}</td>
                        <td className="px-4 py-3">{r["status"] && <Pill tone={statusTone(r["status"])}>{r["status"]}</Pill>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          />
        )}
      </div>
    </>
  );
}
