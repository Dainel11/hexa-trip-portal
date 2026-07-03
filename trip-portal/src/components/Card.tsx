export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  );
}

export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="tag text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium">{value || "—"}</dd>
    </div>
  );
}

export function Pill({ children, tone = "brand" }: { children: React.ReactNode; tone?: "brand" | "amber" | "water" | "muted" }) {
  const map = {
    brand: "bg-brand-soft text-brand",
    amber: "bg-amber/15 text-amber",
    water: "bg-water/15 text-water",
    muted: "bg-line text-muted",
  } as const;
  return <span className={`tag inline-flex items-center rounded-full px-2 py-0.5 ${map[tone]}`}>{children}</span>;
}
