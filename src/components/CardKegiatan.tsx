"use client";

import { CalendarDays, MapPin, Users } from "lucide-react";

interface CardKegiatanProps {
  gambar_url: string;
  nama_penyelenggara: string;
  kuota: number;
  nama_event: string;
  tanggal: string;
  lokasi: string;
  onDetail?: () => void;
}

export default function CardKegiatan({
  gambar_url,
  nama_penyelenggara,
  kuota,
  nama_event,
  tanggal,
  lokasi,
  onDetail,
}: CardKegiatanProps) {
  return (
    <div 
      className="group flex flex-col rounded-3xl overflow-hidden w-full max-w-[300px] border border-[#F88E8E] bg-[#EA7B7B]/30 
                 shadow-xl transition-all duration-300 ease-in-out 
                 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.97] 
                 font-[family-name:var(--font-plus-jakarta)] cursor-pointer"
      onClick={onDetail}
    >
      <div className="px-5 pt-5">
        <div className="w-full h-[150px] relative overflow-hidden rounded-2xl bg-white/40">
          <img
            src={gambar_url || "/empty-img.png"}
            alt={nama_event || "Kegiatan"}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-5 mt-4 mb-4 gap-14">
        <span className="text-[10px] font-bold px-3 py-1 rounded-3xl truncate flex-1 text-center bg-[#EA7B7B]/50 text-[#7D0A0A]">
          {nama_penyelenggara}
        </span>
        <span className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shrink-0 bg-[#EA7B7B]/50 text-[#7D0A0A]">
          <Users size={10} />
          {kuota}
        </span>
      </div>

      <div className="px-5 flex flex-col gap-1 min-h-[90px]">
        <h3 className="font-bold text-[14px] leading-tight mb-1 text-[#7D0A0A]">
          {nama_event}
        </h3>
        <p className="text-xs flex items-center gap-1 font-medium text-[#7D0A0A]/80">
          <CalendarDays size={12} strokeWidth={2.5} /> {tanggal}
        </p>
        <p className="text-xs flex items-center gap-1 font-medium text-[#7D0A0A]/80">
          <MapPin size={12} strokeWidth={2.5} /> {lokasi}
        </p>
      </div>

      <div className="px-5 pb-6">
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onDetail?.();
          }}
          className="w-full py-3 rounded-full font-black text-sm bg-[#7D0A0A] text-[#FCFAEE] transition-all hover:bg-[#F88E8E] active:scale-95 shadow-md tracking-normal"
        >
          DETAIL
        </button>
      </div>
    </div>
  );
}