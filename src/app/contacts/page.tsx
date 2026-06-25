import { getContacts } from "@/lib/sheets";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { telHref } from "@/lib/format";

export const revalidate = 60;
export const metadata = { title: "Contact Person" };

export default async function Page() {
  const rows = await getContacts();
  return (
    <>
      <PageHeader eyebrow="07 · Help" title="Contact Person"
        intro="Need help during the trip? Tap a number to call." />
      <div className="mx-auto max-w-content px-4 py-8">
        {!rows.length ? <EmptyState title="No contacts yet" hint="Fill the Contacts tab in the sheet." /> : (
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map((c, i) => (
              <a key={i} href={telHref(c.phone)}
                className="flex items-center justify-between rounded-2xl border border-line bg-surface p-5 transition hover:border-brand hover:shadow-sm">
                <div>
                  <p className="font-display text-lg font-medium">{c.name}</p>
                  {c.role && <p className="tag text-muted">{c.role}</p>}
                </div>
                <span className="text-right">
                  <span className="block font-mono text-sm text-brand">{c.phone}</span>
                  <span className="tag text-muted">Tap to call</span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
