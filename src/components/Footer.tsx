import { SITE_NAME } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-line">
      <div className="mx-auto max-w-content px-4 py-8 text-sm text-muted">
        {/* Nama Syarikat & Status Portal */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <p className="font-display font-medium text-ink">{SITE_NAME}</p>
            <p className="mt-1">Live information — Internal Portal for Employees & Families.</p>
          </div>
          
          {/* Maklumat Hubungi / Kredit */}
          <p className="text-xs md:text-right">
            Found something off? Contact <span className="font-medium text-ink">Amsha</span>.
          </p>
        </div>

        {/* Garis Pemisah & Hak Cipta */}
        <div className="mt-6 pt-4 border-t border-line/50 text-xs text-muted/80 flex flex-col sm:flex-row sm:justify-between gap-1">
          <p>© {new Date().getFullYear()} HEXA FOOD SDN BHD. All rights reserved.</p>
          <p className="italic text-muted/60">System developed by Amsha</p>
        </div>
      </div>
    </footer>
  );
}
