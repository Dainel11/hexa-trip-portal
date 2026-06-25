export default function PageHeader({
  eyebrow, title, intro, children,
}: { eyebrow: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="contour border-b border-line">
      <div className="mx-auto max-w-content px-4 py-10 sm:py-14">
        <p className="tag text-brand">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </header>
  );
}
