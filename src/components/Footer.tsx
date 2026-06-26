import Link from "next/link";
import { getSettings } from "@/lib/sheets";
import { toRenderableImage } from "./SmartImage";
import { FacebookIcon, InstagramIcon, WhatsappIcon, TiktokIcon } from "./icons";

const QUICK = [
  { href: "/itinerary", label: "Itinerary" },
  { href: "/transport", label: "Transport" },
  { href: "/shirts", label: "Shirts & dress code" },
  { href: "/locations", label: "Locations" },
];

const GOLD = "#f4c95d";
const CREAM = "#e7f0ec";
const MUTED = "#bcd6cd";

export default async function Footer() {
  const s = await getSettings();
  const logo = toRenderableImage((s.logo_url || "").trim());
  const helpName = s.footer_contact_name || "Amsha";
  const helpPhone = s.footer_contact_phone || "0163949558";
  const socials = [
    { url: s.facebook_url, Icon: FacebookIcon, label: "Facebook" },
    { url: s.instagram_url, Icon: InstagramIcon, label: "Instagram" },
    { url: s.tiktok_url, Icon: TiktokIcon, label: "TikTok" },
    { url: s.whatsapp_url, Icon: WhatsappIcon, label: "WhatsApp" },
  ].filter((x) => x.url);

  return (
    <footer className="no-print mt-16" style={{ backgroundColor: "#0e6e5c", color: CREAM }}>
      <div className="mx-auto max-w-content px-4 py-10">
        <div className="text-center">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="HEXA" className="mx-auto h-10 w-auto" />
          ) : (
            <span className="font-display text-xl font-semibold text-white">HEXA Go</span>
          )}
          <p className="mt-2 text-sm" style={{ color: MUTED }}>See you at A&apos;Famosa — jom kita jalan.</p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: GOLD }}>Quick links</p>
            <ul className="mt-3 space-y-2 text-sm">
              {QUICK.map((q) => (
                <li key={q.href}><Link href={q.href} className="transition hover:opacity-80">{q.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: GOLD }}>Need help</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="font-medium">{helpName}</li>
              <li><a href={`tel:${helpPhone.replace(/[^\d+]/g, "")}`} className="transition hover:opacity-80">{helpPhone}</a></li>
              <li style={{ color: MUTED }}>A&apos;Famosa Resort, Melaka · 29–31 Aug 2026</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: GOLD }}>Connect</p>
            {socials.length > 0 ? (
              <div className="mt-3 flex gap-3">
                {socials.map((sc) => (
                  <a key={sc.label} href={sc.url} target="_blank" rel="noopener" aria-label={sc.label}
                    className="grid h-9 w-9 place-items-center rounded-full transition hover:opacity-80"
                    style={{ backgroundColor: "rgba(255,255,255,.12)" }}>
                    <sc.Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm" style={{ color: MUTED }}>Add social links in the sheet.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t pt-5 text-xs sm:flex-row sm:justify-between"
          style={{ borderColor: "rgba(255,255,255,.15)", color: MUTED }}>
          <p>© {new Date().getFullYear()} HEXA FOOD SDN BHD. All rights reserved.</p>
          <p className="italic" style={{ color: "#9cc3b7" }}>System developed by Amsha</p>
        </div>
      </div>
    </footer>
  );
}
