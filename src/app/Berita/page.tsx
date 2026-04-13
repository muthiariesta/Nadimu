"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-[radial-gradient(circle,_#FCFAEE_72%,_#F88E8E_120%)] px-8 py-8 font-[family-name:var(--font-plus-jakarta)] antialiased">
      <div className="relative flex items-center justify-center mb-12">
        <button 
          onClick={() => router.back()} 
          className="absolute left-0 p-1 text-[#7D0A0A] hover:opacity-60 transition-all"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </button>
        
        <h1 className="text-2xl font-black tracking-normal text-[#7D0A0A]">
          BERITA
        </h1>
      </div>

      <div className="max-w-6xl mx-auto">
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