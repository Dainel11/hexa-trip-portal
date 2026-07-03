import { getPax, getPaymentRules } from "@/lib/sheets";
import { computeBreakdown } from "@/lib/payment";
import { groupBy } from "@/lib/format";
import { SHOW_PAYMENTS } from "@/lib/config";
import PageHeader from "@/components/PageHeader";
import PaymentExplorer from "@/components/PaymentExplorer";

export const revalidate = 60;
export const metadata = { title: "Payment" };

export default async function Page() {
  const rules = await getPaymentRules();
  if (!SHOW_PAYMENTS)
    return (<><PageHeader eyebrow="06 · Money" title="Payment" />
      <div className="mx-auto max-w-content px-4 py-8"><PaymentExplorer breakdowns={[]} rules={rules} /></div></>);

  const pax = await getPax();
  const byStaff = groupBy(pax.filter((p) => p.staffName), (p) => p.staffName);
  const breakdowns = [...byStaff.entries()].map(([staff, rows]) => {
    const hasStaff = rows.some((r) => (r.type || "").toLowerCase().includes("staff"));
    const list = hasStaff ? rows : [{ staffName: staff, paxName: staff, type: "staff", age: "" }, ...rows];
    return computeBreakdown(staff, list, rules);
  });

  return (
    <>
      <PageHeader eyebrow="06 · Money" title="Payment"
        intro="Pecahan kos per orang bila bawa keluarga, dan calculator untuk kira sendiri." />
      <div className="mx-auto max-w-content px-4 py-8">
        <PaymentExplorer breakdowns={breakdowns} rules={rules} />
      </div>
    </>
  );
}
