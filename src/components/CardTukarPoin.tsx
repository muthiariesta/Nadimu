"use client";

import { Gift, Stethoscope, ShoppingBag, Package, BadgePercent, MapPin } from "lucide-react";

interface CardVoucherProps {
  nama: string;
  deskripsi: string;
  poin_dibutuhkan: number;
  stok: number;
  onTukar?: () => void;
}

function getIcon(nama: string) {
  const n = (nama ?? "").toLowerCase();
  if (n.includes("medical") || n.includes("check")) return <Stethoscope size={18} />;
  if (n.includes("belanja") || n.includes("voucher")) return <ShoppingBag size={18} />;
  if (n.includes("hampers") || n.includes("sembako")) return <Package size={18} />;
  if (n.includes("pin") || n.includes("enamel")) return <BadgePercent size={18} />;
  if (n.includes("diskon") || n.includes("apotek")) return <BadgePercent size={18} />;
  return <Gift size={18} />;
}

function getLocation(deskripsi: string) {
  const match = (deskripsi ?? "").match(/lokasi:\s*(.+)/i);
  return match ? match[1].trim() : "PMI Terdekat";
}

export default function CardVoucher({ nama, deskripsi, poin_dibutuhkan, stok, onTukar }: CardVoucherProps) {
  const habis = stok === 0;

  return (
    <div
      className="relative flex flex-col w-full"
      style={{
        background: "#FCE4E4",
        border: "1px solid #7D0A0A",
        borderRadius: "24px", // Radius luar yang konsisten
      }}
    >
      <div className="flex justify-center -mt-5 mb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-[#7D0A0A]/20 z-10"
          style={{ backgroundColor: "#7D0A0A", color: "#FCFAEE" }}
        >
          {getIcon(nama)}
        </div>
      </div>

      <div className="px-3 pb-5 flex flex-col items-center gap-1 flex-1">
        <h3
          className="font-bold text-[14px] text-center leading-tight min-h-[40px] flex items-center justify-center mt-1"
          style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {nama ?? "-"}
        </h3>

        <div className="flex items-center justify-center gap-1 opacity-70">
          <MapPin size={12} className="text-[#7D0A0A]" />
          <span
            className="text-[11px] font-medium"
            style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {getLocation(deskripsi)}
          </span>
        </div>

        <p
          className="text-[12px] font-black mt-2"
          style={{ color: "#47770D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {poin_dibutuhkan} poin
        </p>
      </div>

      <button
        onClick={onTukar}
        disabled={habis}
        className="w-full py-3.5 font-bold tracking-[0.2em] text-[12px] transition-all duration-200 outline-none
                   hover:bg-[#a31d1d] active:bg-[#F88E8E] active:text-[#7D0A0A] disabled:opacity-40
                   rounded-b-[22px]" // Ini kuncinya biar ga kotak pas diklik
        style={{
          backgroundColor: "#7D0A0A",
          color: "#FCFAEE",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          borderTop: "1px solid #7D0A0A",
        }}
      >
        {habis ? "HABIS" : "TUKARKAN"}
      </button>
    </div>
  );
}