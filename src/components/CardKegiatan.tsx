"use client";

import Image from "next/image";
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
      className="flex flex-col rounded-2xl overflow-hidden transition-all w-full max-w-[300px] border active:scale-[0.97]"
      style={{
        backgroundColor: "rgba(234, 123, 123, 0.30)",
        borderColor: "#F88E8E",
        boxShadow: "0px 2px 10px rgba(125,10,10,0.05)",
      }}
    >
      <div className="px-5 pt-5">
        <div className="w-full h-[150px] relative overflow-hidden rounded-2xl bg-white/40">
          <Image
            src={gambar_url || "/empty-img.png"}
            alt={nama_event || "Kegiatan"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-5 mt-4 mb-2 gap-20">
        <span
          className="text-[10px] font-bold px-3 py-1 rounded-3xl truncate flex-1 text-center"
          style={{
            backgroundColor: "rgba(234, 123, 123, 0.50)",
            color: "#7D0A0A",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {nama_penyelenggara}
        </span>
        <span
          className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shrink-0"
          style={{
            backgroundColor: "rgba(234, 123, 123, 0.50)", 
            color: "#7D0A0A",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <Users size={10} />
          {kuota}
        </span>
      </div>

      <div className="px-5 flex flex-col gap-1 min-h-[90px]">
        <h3
          className="font-bold text-[14px] leading-tight mb-1"
          style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {nama_event}
        </h3>
        <p
          className="text-[11px] flex items-center gap-1 font-medium"
          style={{ color: "#7D0A0A", opacity: 0.8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <CalendarDays size={12} strokeWidth={2.5} /> {tanggal}
        </p>
        <p
          className="text-[11px] flex items-center gap-1 font-medium"
          style={{ color: "#7D0A0A", opacity: 0.8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <MapPin size={12} strokeWidth={2.5} /> {lokasi}
        </p>
      </div>

      <div className="px-5 pb-6 mt-2">
        <button
          onClick={onDetail}
          className="w-full py-3 rounded-full font-black tracking-widest text-[11px] transition-all bg-[#7D0A0A] text-[#FCFAEE] hover:bg-[#F88E8E] active:scale-95 shadow-md"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "0.2em",
          }}
>
            DETAIL
          </button>
      </div>
    </div>
  );
}