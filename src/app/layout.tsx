import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { SITE_NAME } from "@/lib/config";
import { getSettings } from "@/lib/sheets";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  // 1. TUKAR NAMA PORTAL DI SINI (Contoh: HEXA Hub atau HEXA Corporate Trip)
  title: { default: "HEXA Go", template: `%s · HEXA Go` },
  description: "Everything you need for the company trip — rooms, transport, schedule and more.",
  // 2. TUKAR IKON BUMI KEPADA LOGO HEXA DI SINI
  icons: {
    icon: "https://www.image2url.com/r2/default/images/1782449481103-502f082d-7833-4f62-aa85-949f4ee5409e.png",
  },
};
export const viewport: Viewport = { themeColor: "#0e6e5c", width: "device-width", initialScale: 1 };

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Nav logo={settings.logo_url} />
        <AnnouncementBanner title={settings.announcement_title} text={settings.announcement} />
        <main className="min-h-[70vh] pb-24 lg:pb-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
