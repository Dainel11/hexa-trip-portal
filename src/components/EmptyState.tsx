export default function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-10 text-center">
      <p className="font-display text-lg font-medium">{title}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </div>
  );
}
