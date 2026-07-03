/**
 * Renders an image from a sheet-provided URL.
 * Auto-converts Google Drive share links into a hot-linkable form so HR can
 * just paste a normal Drive link (file must be shared "Anyone with the link").
 * Any normal image URL (postimages, imgur, /public file, etc.) also works.
 */
export function toRenderableImage(src?: string): string {
  if (!src) return "";
  const s = src.trim();
  // drive.google.com/file/d/ID/view  |  open?id=ID  |  uc?...id=ID
  const m = s.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1600`;
  return s;
}

export default function SmartImage({
  src, alt, className = "",
}: { src?: string; alt: string; className?: string }) {
  const url = toRenderableImage(src);
  if (!url) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} loading="lazy" className={className} />;
}
