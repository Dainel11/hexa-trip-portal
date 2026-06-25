/* Plain <img> wrapper so sheet-provided URLs from anywhere just work. */
export default function SmartImage({
  src, alt, className = "",
}: { src?: string; alt: string; className?: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}
