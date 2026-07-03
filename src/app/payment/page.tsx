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

  // 🧠 SAFE FALLBACK (prevents undefined crash)
  const safeRules = {
    bank_name: rules?.bank_name || "-",
    account_name: rules?.account_name || "-",
    account_number: rules?.account_number || "-",
    duitnow_qr: rules?.duitnow_qr || null,
    payment_reference: rules?.payment_reference || "-",
    payment_contact: rules?.payment_contact || "-",
    pay_staff: Number(rules?.pay_staff || 0),
    pay_adult_1: Number(rules?.pay_adult_1 || 0),
    pay_adult_2plus: Number(rules?.pay_adult_2plus || 0),
    pay_child: Number(rules?.pay_child || 0),
    pay_infant: Number(rules?.pay_infant || 0),
  };

  // 🚫 PAYMENT HIDDEN MODE
  if (!SHOW_PAYMENTS) {
    return (
      <>
        <PageHeader eyebrow="06 · Money" title="Payment" />
        <div className="mx-auto max-w-content px-4 py-8">
          <PaymentExplorer breakdowns={[]} rules={safeRules} />
        </div>
      </>
    );
  }

  const pax = await getPax();

  // 🧠 SAFE ARRAY GUARD
  const safePax = Array.isArray(pax) ? pax : [];

  const byStaff = groupBy(
    safePax.filter((p) => p?.staffName),
    (p) => p.staffName
  );

  const breakdowns = [...byStaff.entries()].map(([staff, rows]) => {
    const safeRows = Array.isArray(rows) ? rows : [];

    const hasStaff = safeRows.some((r) =>
      (r?.type || "").toLowerCase().includes("staff")
    );

    const list = hasStaff
      ? safeRows
      : [
          {
            staffName: staff,
            paxName: staff,
            type: "staff",
            age: "",
          },
          ...safeRows,
        ];

    return computeBreakdown(staff, list, safeRules);
  });

  return (
    <>
      <PageHeader
        eyebrow="06 · Money"
        title="Payment"
        intro="Pecahan kos per orang bila bawa keluarga, dan calculator untuk kira sendiri."
      />

      <div className="mx-auto max-w-content px-4 py-8">
        <PaymentExplorer breakdowns={breakdowns} rules={safeRules} />
      </div>
    </>
  );
}
