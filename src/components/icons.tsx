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

export function FacebookIcon({ className = base }: P) { return (<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.4V5.5C16 5.4 15.1 5.3 14.1 5.3c-2.1 0-3.6 1.3-3.6 3.7v2.2H8.2V14h2.3v7z"/></svg>); }
export function InstagramIcon({ className = base }: P) { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.4"/><circle cx="16.7" cy="7.3" r="1" fill="currentColor" stroke="none"/></svg>); }
export function WhatsappIcon({ className = base }: P) { return (<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3zm0 2a7 7 0 0 1 5.9 10.8l-.3.4.6 2.2-2.3-.6-.4.2A7 7 0 1 1 12 5zm-2.7 3.3c-.2 0-.5 0-.7.4-.2.4-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.7 2.8 4.3 3.7 2.1.8 2.6.6 3 .6.5 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.3-.2-.6-.3-.3-.2-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1-.6-.2-1.3-.5-2-1.2-.5-.5-.9-1.1-1-1.3-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.3.2-.4 0-.2 0-.3 0-.4l-.6-1.6c-.2-.4-.3-.4-.5-.4z"/></svg>); }
export function TiktokIcon({ className = base }: P) { return (<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M16 3c.3 1.8 1.4 3.2 3 3.5v2.4c-1.1.1-2.1-.2-3-.7v5.6a5.3 5.3 0 1 1-5.3-5.3c.3 0 .5 0 .8.1v2.5c-.3-.1-.5-.1-.8-.1a2.8 2.8 0 1 0 2.8 2.8V3z"/></svg>); }
