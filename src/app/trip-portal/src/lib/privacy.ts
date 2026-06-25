/**
 * Privacy helpers. The portal NEVER renders IC/passport numbers — the parser
 * simply doesn't expose them to any page. These helpers exist as a second line
 * of defence in case a future column slips through.
 */
export function maskIC(value: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "••••";
  return `••••••${digits.slice(-4)}`;
}

/** Strip any header that looks like an identity document before it reaches the UI. */
const BLOCKED = /(^|_)(ic|ic_no|icno|nric|passport|mykad|identity)(_|$)/i;
export function isBlockedField(header: string): boolean {
  return BLOCKED.test(header.replace(/\s+/g, "_"));
}
