type P = { className?: string };
const base = "h-5 w-5";

export function BusIcon({ className = base }: P) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9H4z"/><path d="M4 10h16"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/><path d="M5 15v2M19 15v2"/></svg>);
}
export function VanIcon({ className = base }: P) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M3 7h9l4 4h4v4H3z"/><path d="M12 7v4h4"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/></svg>);
}
export function CarIcon({ className = base }: P) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M3 13l2-5a2 2 0 0 1 2-1.3h10A2 2 0 0 1 19 8l2 5"/><path d="M3 13h18v4H3z"/><circle cx="7.5" cy="17.5" r="1.4"/><circle cx="16.5" cy="17.5" r="1.4"/></svg>);
}
export function MenuIcon({ className = "h-6 w-6" }: P) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden><path d="M4 7h16M4 12h16M4 17h16"/></svg>);
}
export function CloseIcon({ className = "h-6 w-6" }: P) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>);
}

export function VehicleIcon({ vehicle, className = base }: { vehicle: string; className?: string }) {
  const v = vehicle.toUpperCase();
  if (v.includes("BUS")) return <BusIcon className={className} />;
  if (v.includes("VAN")) return <VanIcon className={className} />;
  return <CarIcon className={className} />;
}
