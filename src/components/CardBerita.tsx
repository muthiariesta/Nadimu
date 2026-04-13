"use client";

import { ArrowRight } from "lucide-react";

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
      onClick={() => onClick?.(slug)}
      className="group flex flex-col w-full max-w-[300px] rounded-3xl overflow-hidden cursor-pointer 
                 bg-[#EA7B7B]/30 border border-[#F88E8E] shadow-xl 
                 transition-all duration-300 ease-in-out font-[family-name:var(--font-plus-jakarta)]
                 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.97]"
    >
      <div className="pt-7 px-6 pb-3">
        <h3 className="font-bold text-base leading-tight text-center text-[#7D0A0A] 
                       min-h-[48px] flex items-center justify-center line-clamp-2">
          {judul}
        </h3>
      </div>

      <div className="px-4">
        <div className="w-full aspect-[4/3] relative overflow-hidden rounded-2xl bg-white/60 shadow-inner">
          <img
            src={gambar_url || "/empty-img.png"}
            alt={judul}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-6 pt-4">
        <p className="text-sm font-medium leading-relaxed text-left text-[#7D0A0A] line-clamp-4">
          {isi}
        </p>
        
        <div className="flex items-center gap-1 mt-3 group/btn">
          <span className="text-xs font-bold text-[#7D0A0A]">
            Lihat Selengkapnya
          </span>
          
          <ArrowRight 
            size={14} 
            className="text-[#7D0A0A] transition-transform duration-300 group-hover/btn:translate-x-1" 
          />
        </div>
      </div>
    </div>
  );
}