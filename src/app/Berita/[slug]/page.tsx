"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
    <div className="min-h-screen bg-[radial-gradient(circle,_#FCFAEE_72%,_#F88E8E_120%)] px-8 py-8 font-[family-name:var(--font-plus-jakarta)]">
      <div className="relative flex items-center justify-center mb-8">
        <button
          onClick={() => router.back()}
          className="absolute left-0 p-1 text-[#7D0A0A] hover:opacity-60 transition-all"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </button>

        <h1 className="text-2xl font-black uppercase tracking-normal text-[#7D0A0A] text-center max-w-[80%]">
          {berita?.judul}
        </h1>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-[500px] aspect-[16/9] relative rounded-2xl border-[#7D0A0A] border-1 overflow-hidden mb-10 mt-2 shadow-xd bg-white/60">
          <img
            src={berita?.gambar_url || "/empty-img.png"}
            alt={berita?.judul || "Berita"}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-full">
          <p className="text-sm leading-relaxed text-justify whitespace-pre-line text-[#7D0A0A] font-medium">
            {berita?.isi}
          </p>
        </div>
      </div>
    </div>
  );
}