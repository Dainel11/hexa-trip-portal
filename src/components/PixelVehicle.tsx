// Pixel-art vehicle sprites (crisp, cross-device consistent — no emoji variance).
// Retro highway style for the Transport metric cards only.

type Props = { type: "bus" | "van" | "car"; className?: string };

const px = { shapeRendering: "crispEdges" as const, style: { imageRendering: "pixelated" as const } };

export default function PixelVehicle({ type, className = "" }: Props) {
  if (type === "van") {
    return (
      <svg viewBox="0 0 46 30" role="img" aria-label="Van" className={`h-11 w-auto ${className}`} {...px}>
        <rect x="13" y="5" width="21" height="4" fill="#9aa3af" />           {/* gray roof */}
        <rect x="5" y="9" width="34" height="12" fill="#f4c02f" />           {/* yellow body */}
        <rect x="36" y="11" width="5" height="10" fill="#f0b41f" />          {/* nose */}
        <rect x="14" y="10" width="13" height="5" fill="#bfe6f2" />          {/* side window */}
        <rect x="34" y="11" width="4" height="4" fill="#bfe6f2" />           {/* front window */}
        <rect x="24" y="10" width="1" height="9" fill="#d9a70f" />           {/* door seam */}
        <rect x="5" y="20" width="34" height="1" fill="#c99a1f" />           {/* bumper */}
        <rect x="40" y="15" width="2" height="2" fill="#fff3b0" />           {/* headlight */}
        <rect x="10" y="20" width="7" height="7" fill="#2b2f36" /><rect x="12" y="22" width="3" height="3" fill="#6b7280" />
        <rect x="29" y="20" width="7" height="7" fill="#2b2f36" /><rect x="31" y="22" width="3" height="3" fill="#6b7280" />
      </svg>
    );
  }
  if (type === "bus") {
    return (
      <svg viewBox="0 0 54 30" role="img" aria-label="Bus" className={`h-11 w-auto ${className}`} {...px}>
        <rect x="4" y="4" width="46" height="4" fill="#9aa3af" />            {/* gray roof */}
        <rect x="4" y="8" width="46" height="14" fill="#f4c02f" />           {/* yellow body */}
        <rect x="7" y="10" width="6" height="5" fill="#bfe6f2" /><rect x="15" y="10" width="6" height="5" fill="#bfe6f2" />
        <rect x="23" y="10" width="6" height="5" fill="#bfe6f2" /><rect x="31" y="10" width="6" height="5" fill="#bfe6f2" />
        <rect x="40" y="9" width="7" height="13" fill="#3a4150" />           {/* open door */}
        <rect x="41" y="10" width="5" height="11" fill="#5a6577" />
        <rect x="4" y="18" width="46" height="1" fill="#d9a70f" />           {/* stripe */}
        <rect x="11" y="21" width="7" height="7" fill="#2b2f36" /><rect x="13" y="23" width="3" height="3" fill="#6b7280" />
        <rect x="34" y="21" width="7" height="7" fill="#2b2f36" /><rect x="36" y="23" width="3" height="3" fill="#6b7280" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 46 28" role="img" aria-label="Car with family" className={`h-10 w-auto ${className}`} {...px}>
      <rect x="12" y="7" width="22" height="9" fill="#e0544e" />             {/* cabin */}
      <rect x="4" y="15" width="38" height="8" fill="#e0544e" />             {/* body */}
      <rect x="14" y="9" width="18" height="5" fill="#bfe6f2" />             {/* windshield */}
      <rect x="16" y="10" width="3" height="3" fill="#8d5524" />            {/* family head 1 */}
      <rect x="21" y="10" width="3" height="3" fill="#e0ac69" />            {/* family head 2 */}
      <rect x="26" y="10" width="2" height="2" fill="#5a3d2b" />            {/* child */}
      <rect x="4" y="22" width="38" height="1" fill="#b23b36" />            {/* bumper */}
      <rect x="41" y="17" width="2" height="2" fill="#fff3b0" />            {/* headlight */}
      <rect x="9" y="22" width="7" height="6" fill="#2b2f36" /><rect x="11" y="24" width="3" height="2" fill="#6b7280" />
      <rect x="30" y="22" width="7" height="6" fill="#2b2f36" /><rect x="32" y="24" width="3" height="2" fill="#6b7280" />
    </svg>
  );
}
