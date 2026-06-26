import { SITE_NAME } from "@/lib/config";
export default function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-line">
      <div className="mx-auto max-w-content px-4 py-8 text-sm text-muted">
        <p className="font-display font-medium text-ink">{SITE_NAME}</p>
        <p className="mt-1">Live information — Internal Portal for Employees & Families. • Powered by Google Sheets & Vercel.</p>
        <p className="mt-2"> Found something off? Message a contact Amsha.</p>
      </div>
    </footer>
  );
}
