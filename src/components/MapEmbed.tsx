/** Lightweight Google Maps preview — no API key needed (output=embed). */
export default function MapEmbed({ query, className = "" }: { query: string; className?: string }) {
  if (!query) return null;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <iframe
      title={`Map of ${query}`}
      src={src}
      loading="lazy"
      className={`h-40 w-full border-0 ${className}`}
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
