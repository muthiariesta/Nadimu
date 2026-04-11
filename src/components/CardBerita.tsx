"use client";

import Image from "next/image";

interface CardBeritaProps {
  judul: string;
  slug: string;
  isi: string;
  gambar_url: string;
  onClick?: (slug: string) => void;
}

export default function CardBerita({ judul, slug, isi, gambar_url, onClick }: CardBeritaProps) {
  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden cursor-pointer active:scale-[0.97] transition-all w-full max-w-[300px] border"
      style={{
        background: "rgba(234, 123, 123, 0.3)", 
        borderColor: "#F88E8E", 
        boxShadow: "0px 2px 8px rgba(125,10,10,0.05)", 
      }}
      onClick={() => onClick?.(slug)}
    >

      <div className="pt-7 px-6 pb-3">
        <h3
          className="font-bold text-[16px] leading-tight text-center min-h-[42px] flex items-center justify-center"
          style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {judul}
        </h3>
      </div>

      <div className="px-4">
        <div className="w-full aspect-[4/3] relative overflow-hidden rounded-xl bg-white/60 shadow-inner">
          <Image
            src={gambar_url || "/empty-img.png"}
            alt={judul}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-6 pt-4">
        <p
          className="text-[14px] text-medium leading-relaxed text-left line-clamp-4"
          style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {isi}
        </p>
        <span
          className="text-[12px] font-extrabold mt-3"
          style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Lihat Selengkapnya
        </span>
      </div>
    </div>
  );
}