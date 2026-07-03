import Link from "next/link";
import { getSettings } from "@/lib/sheets";
import { toRenderableImage } from "./SmartImage";
import { phoneDisplay, waHref } from "@/lib/format";
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
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="text-center">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="HEXA" className="mx-auto h-11 w-auto" />
          ) : (
            <span className="font-display text-2xl font-semibold text-white">HEXA Go</span>
          )}
          <p className="mt-3 text-sm" style={{ color: MUTED }}>See you at A&apos;Famosa — jom kita jalan.</p>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD }}>Quick links</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className="inline-block transition-all duration-200 hover:translate-x-0.5 hover:opacity-80">{q.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD }}>Need help</p>
            <p className="mt-4 text-sm font-medium">{helpName}</p>
            <a href={waHref(helpPhone)} target="_blank" rel="noopener"
              className="group mt-2 inline-flex items-center gap-2.5 rounded-full px-3 py-2 text-sm transition-all duration-200 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,.18)" }}>
              <span className="grid h-7 w-7 place-items-center rounded-full transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: "rgba(255,255,255,.14)" }}>
                <WhatsappIcon className="h-4 w-4" />
              </span>
              <span className="font-mono tracking-tight">{phoneDisplay(helpPhone)}</span>
            </a>
            <p className="mt-3 text-xs" style={{ color: MUTED }}>A&apos;Famosa Resort, Melaka · 29–31 Aug 2026</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD }}>Connect</p>
            {socials.length > 0 ? (
              <div className="mt-4 flex gap-3">
                {socials.map((sc) => (
                  <a key={sc.label} href={sc.url} target="_blank" rel="noopener" aria-label={sc.label}
                    className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-white/90 transition-all duration-200 hover:scale-110 hover:bg-white/20 hover:text-white"
                    style={{ backgroundColor: "rgba(255,255,255,.10)" }}>
                    <sc.Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm" style={{ color: MUTED }}>Add social links in the sheet.</p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1.5 border-t pt-6 text-xs sm:flex-row sm:justify-between"
          style={{ borderColor: "rgba(255,255,255,.15)", color: MUTED }}>
          <p>© {new Date().getFullYear()} HEXA FOOD SDN BHD. All rights reserved.</p>
          <p className="italic" style={{ color: "#9cc3b7" }}>System developed by Amsha</p>
        </div>
      </div>
    </footer>
  );
}
