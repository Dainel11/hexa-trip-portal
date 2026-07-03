"use client";
import { useMemo, useState } from "react";
import { rm } from "@/lib/format";
import { calcTotal, type Breakdown, type PaymentRules } from "@/lib/payment";

const TONE: Record<string, string> = {
  staff: "bg-line text-muted",
  guest: "bg-amber/15 text-amber",
  child: "bg-water/15 text-water",
  infant: "bg-brand-soft text-brand",
};

export default function PaymentExplorer({ breakdowns, rules, bank }: { breakdowns: Breakdown[]; rules: PaymentRules; bank?: BankInfo }) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const matches = useMemo(
    () => (term ? breakdowns.filter((b) => b.staff.toLowerCase().includes(term)) : []),
    [term, breakdowns],
  );

  return (
    <div className="space-y-12">
      {/* ── Search a staff to see their breakdown ── */}
      <section>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Your cost breakdown</h2>
        <p className="mt-1 text-sm text-muted">Search your name to see who you bring and the cost per person.</p>
        <div className="relative mt-4">
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your name…"
            className="w-full rounded-full border border-line bg-surface py-3 pl-10 pr-4 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30" />
        </div>

        {term && (
          matches.length ? (
            <div className="mt-5 space-y-5">
              {matches.map((b) => (
                <div key={b.staff} className="overflow-hidden rounded-2xl border border-line bg-surface">
                  <div className="flex items-center justify-between border-b border-line px-5 py-3">
                    <p className="font-display text-lg font-semibold">{b.staff}</p>
                    <span className="tag text-muted">{b.items.length} pax</span>
                  </div>
                  <ul className="divide-y divide-line/70">
                    {b.items.map((it, i) => (
                      <li key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{it.name}</span>
                          <span className={`tag rounded-full px-2 py-0.5 ${TONE[it.type]}`}>{it.label}{it.age !== null ? ` · ${it.age}y` : ""}</span>
                        </span>
                        <span className="font-semibold">{rm(it.price)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between bg-brand-soft/40 px-5 py-3">
                    <span className="font-medium">Total to pay</span>
                    <span className="font-display text-xl font-bold text-brand">{rm(b.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
              No record for “{q}”. Your pax list may not be filled in yet — use the calculator below.
            </p>
          )
        )}
      </section>

      {/* ── Calculator ── */}
      <Calculator rules={rules} />

      {/* ── Bank / DuitNow payment instructions ── */}
      <BankCard bank={bank} />
    </div>
  );
}

type BankInfo = { bankName: string; accountName: string; accountNumber: string; qrUrl: string; reference: string };

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
      }}
      aria-label="Copy account number"
      className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium transition hover:border-brand focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function BankCard({ bank }: { bank?: BankInfo }) {
  if (!bank || (!bank.accountNumber && !bank.bankName)) return null;
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold tracking-tight">How to pay</h2>
      <p className="mt-1 text-sm text-muted">Bank transfer or DuitNow QR. Please use the reference below.</p>
      <div className="mx-auto mt-4 grid max-w-2xl gap-5 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-[1.3fr_1fr] sm:items-center">
        <dl className="space-y-3 text-sm">
          {bank.bankName && (<div><dt className="tag text-muted">Bank</dt><dd className="font-medium">{bank.bankName}</dd></div>)}
          {bank.accountName && (<div><dt className="tag text-muted">Account name</dt><dd className="font-medium">{bank.accountName}</dd></div>)}
          {bank.accountNumber && (
            <div>
              <dt className="tag text-muted">Account number</dt>
              <dd className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-base font-semibold tracking-wide">{bank.accountNumber}</span>
                <CopyButton value={bank.accountNumber} />
              </dd>
            </div>
          )}
          {bank.reference && (<div><dt className="tag text-muted">Payment reference</dt><dd className="font-medium">{bank.reference}</dd></div>)}
        </dl>
        {bank.qrUrl && (
          <figure className="mx-auto w-full max-w-[300px]">
            <div className="mx-auto aspect-square w-full overflow-hidden rounded-xl border border-line bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bank.qrUrl} alt="DuitNow QR code" width={300} height={300} loading="lazy" className="h-full w-full object-contain" />
            </div>
            <figcaption className="tag mt-2 text-center text-muted">Scan with any banking app</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

function Stepper({ label, hint, value, set }: { label: string; hint: string; value: number; set: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
      <div>
        <p className="font-medium">{label}</p>
        <p className="tag text-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => set(Math.max(0, value - 1))} aria-label={`Less ${label}`} className="grid h-9 w-9 place-items-center rounded-full border border-line text-lg leading-none hover:bg-brand-soft">−</button>
        <span className="w-6 text-center font-display text-lg font-semibold tabular-nums">{value}</span>
        <button onClick={() => set(value + 1)} aria-label={`More ${label}`} className="grid h-9 w-9 place-items-center rounded-full border border-line text-lg leading-none hover:bg-brand-soft">+</button>
      </div>
    </div>
  );
}

function Calculator({ rules }: { rules: PaymentRules }) {
  const [guests, setGuests] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const total = calcTotal(guests, children, infants, rules);

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold tracking-tight">Cost calculator</h2>
      <p className="mt-1 text-sm text-muted">Kira sendiri — kalau bawa sekian orang, berapa perlu bayar.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Stepper label="Adult guests" hint={`RM${rules.adultGuest[0]} first, RM${rules.adultGuest[1]} after`} value={guests} set={setGuests} />
        <Stepper label="Children" hint={`Age ${rules.infantMaxAge}–${rules.childMaxAge} · RM${rules.child} each`} value={children} set={setChildren} />
        <Stepper label={`Infants (under ${rules.infantMaxAge})`} hint={`RM${rules.infant} — free`} value={infants} set={setInfants} />
        <div className="flex items-center justify-between rounded-xl border border-brand bg-brand-soft/40 px-5 py-3">
          <span className="font-medium">Total</span>
          <span className="font-display text-2xl font-bold text-brand">{rm(total)}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">Staff sendiri percuma (RM0). Harga ikut config — boleh diubah dari Settings.</p>
    </section>
  );
}
