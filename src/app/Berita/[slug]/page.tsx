"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Berita {
  judul: string;
  isi: string;
  gambar_url: string;
}

export default function DetailBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailBerita = async () => {
      const { data } = await supabase
        .from("berita")
        .select("judul, isi, gambar_url")
        .eq("slug", params.slug)
        .single();

      if (data) {
        setBerita(data);
      }
      setLoading(false);
    };

    if (params.slug) fetchDetailBerita();
  }, [params.slug]);

  if (loading) return null;

  return (
    <div
      className="min-h-screen px-8 py-16" 
      style={{
        background: "radial-gradient(circle, #FCFAEE 62%, #F88E8E 100%)",
      }}
    >

      <div className="max-w-5xl mx-auto flex items-start mb-8">
        <button
          onClick={() => router.back()}
          className="mt-1 text-[#7D0A0A] hover:opacity-60 transition-all"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        
        <h1
          className="flex-1 text-center text-xl md:text-2xl font-black uppercase tracking-widest px-4"
          style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {berita?.judul}
        </h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-[500px] aspect-[16/9] relative rounded-2xl overflow-hidden mb-8 shadow-md">
          <Image
            src={berita?.gambar_url || "/empty-img.png"}
            alt={berita?.judul || "Berita"}
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full">
          <p
            className="text-sm md:text-[15px] leading-relaxed text-justify whitespace-pre-line"
            style={{ 
              color: "#7D0A0A", 
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: "500" 
            }}
          >
            {berita?.isi}
          </p>
        </div>
      </div>
    </div>
  );
}