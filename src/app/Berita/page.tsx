"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CardBerita from "@/components/CardBerita";

interface Berita {
  id: number;
  judul: string;
  slug: string;
  isi: string;
  gambar_url: string;
}

export default function BeritaPage() {
  const router = useRouter();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);

  useEffect(() => {
    const fetchBerita = async () => {
      const { data } = await supabase.from("berita").select("*");
      if (data) setBeritaList(data);
    };
    fetchBerita();
  }, []);

  return (
    <div 
      className="min-h-screen px-4 py-16" 
      style={{ 
        background: "radial-gradient(circle, #FCFAEE 62%, #F88E8E 100%)" 
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center mb-12">
        <button onClick={() => router.back()} className="text-[#7D0A0A] hover:opacity-60 transition-all">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1
          className="flex-1 text-center text-3xl font-black tracking-[0.2em] pr-8"
          style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          BERITA
        </h1>
      </div>

      {/* Grid - Jarak Horizontal Rapat (gap-x-4) & Jarak Vertikal Jelas (gap-y-12) */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 justify-items-center">
          {beritaList.map((item) => (
            <CardBerita
              key={item.id}
              judul={item.judul}
              slug={item.slug}
              isi={item.isi}
              gambar_url={item.gambar_url}
              onClick={(slug) => router.push(`/Berita/${slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}