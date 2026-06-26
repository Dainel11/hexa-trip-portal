type P = { className?: string };
const base = "h-5 w-5";
const S = (d: string, cn = base) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cn} aria-hidden dangerouslySetInnerHTML={{ __html: d }} />
);

export function BusIcon({ className = base }: P) { return S('<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9H4z"/><path d="M4 10h16"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/><path d="M5 15v2M19 15v2"/>', className); }
export function VanIcon({ className = base }: P) { return S('<path d="M3 7h9l4 4h4v4H3z"/><path d="M12 7v4h4"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>', className); }
export function CarIcon({ className = base }: P) { return S('<path d="M3 13l2-5a2 2 0 0 1 2-1.3h10A2 2 0 0 1 19 8l2 5"/><path d="M3 13h18v4H3z"/><circle cx="7.5" cy="17.5" r="1.4"/><circle cx="16.5" cy="17.5" r="1.4"/>', className); }
export function MenuIcon({ className = "h-6 w-6" }: P) { return S('<path d="M4 7h16M4 12h16M4 17h16"/>', className); }
export function CloseIcon({ className = "h-6 w-6" }: P) { return S('<path d="M6 6l12 12M18 6L6 18"/>', className); }
export function HomeIcon({ className = base }: P) { return S('<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>', className); }
export function CalendarIcon({ className = base }: P) { return S('<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 9h17M8 3v4M16 3v4"/>', className); }
export function ShirtIcon({ className = base }: P) { return S('<path d="M8 4l4 2 4-2 4 3-2.5 3H18v10H6V10H4.5L2 7z"/>', className); }
export function MapPinIcon({ className = base }: P) { return S('<path d="M12 21s-6.5-5.3-6.5-10A6.5 6.5 0 0 1 18.5 11c0 4.7-6.5 10-6.5 10z"/><circle cx="12" cy="11" r="2.2"/>', className); }
export function GridIcon({ className = base }: P) { return S('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>', className); }
export function PhoneIcon({ className = base }: P) { return S('<path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5 5L19 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>', className); }
export function WalletIcon({ className = base }: P) { return S('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14" r="1"/>', className); }

export function VehicleIcon({ vehicle, className = base }: { vehicle: string; className?: string }) {
  const v = vehicle.toUpperCase();
  if (v.includes("BUS")) return <BusIcon className={className} />;
  if (v.includes("VAN")) return <VanIcon className={className} />;
  return <CarIcon className={className} />;
}
