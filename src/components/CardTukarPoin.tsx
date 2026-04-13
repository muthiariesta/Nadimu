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
    <div className="relative flex flex-col w-full bg-[#FCE4E4] border border-[#7D0A0A] rounded-[24px]">
      
      <div className="flex justify-center -mt-5 mb-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-[#7D0A0A]/20 z-10 bg-[#7D0A0A] text-[#FCFAEE]">
          {getIcon(nama)}
        </div>
      </div>

      <div className="px-3 pb-5 flex flex-col items-center gap-1 flex-1 font-jakarta">
        <h3 className="font-bold text-sm text-center leading-tight min-h-[40px] flex items-center justify-center mt-1 text-[#7D0A0A]">
          {nama ?? "-"}
        </h3>

        <div className="flex items-center justify-center gap-1 opacity-70">
          <MapPin size={12} className="text-[#7D0A0A]" />
          <span className="text-[11px] font-medium text-[#7D0A0A]">
            {getLocation(deskripsi)}
          </span>
        </div>

        <p className="text-xs font-black mt-2 text-[#47770D]">
          {poin_dibutuhkan} poin
        </p>
      </div>

      <button
        onClick={onTukar}
        disabled={habis}
        className="w-full py-3.5 font-bold text-sm transition-all duration-200 outline-none
                   bg-[#7D0A0A] text-[#FCFAEE] border-t border-[#7D0A0A] rounded-b-[22px]
                   hover:bg-[#a31d1d] active:bg-[#F88E8E] active:text-[#7D0A0A] 
                   disabled:opacity-40 font-jakarta"
      >
        {habis ? "HABIS" : "TUKARKAN"}
      </button>
    </div>
  );
}