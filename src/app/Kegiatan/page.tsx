"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CardKegiatan from "@/components/CardKegiatan";

interface Kegiatan {
  id: string;
  nama_event: string;
  tanggal: string;
  lokasi: string;
  gambar_url: string;
  kuota: number;
  institusi: {
    nama_institusi: string;
  };
}

const PER_PAGE = 9;

export default function KegiatanPage() {
  const router = useRouter();
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  useEffect(() => {
    const fetchKegiatan = async () => {
      const from = (currentPage - 1) * PER_PAGE;
      const to = from + PER_PAGE - 1;

      const { data, count } = await supabase
        .from("event_donor")
        .select("id, nama_event, tanggal, lokasi, gambar_url, kuota, institusi:penyelenggara_id(nama_institusi)", { count: "exact" })
        .eq("status", "aktif")
        .range(from, to);

      if (data) setKegiatanList(data as unknown as Kegiatan[]);
      if (count !== null) setTotalCount(count);
    };
    fetchKegiatan();
  }, [currentPage]);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3, "...", totalPages]; 
  };

  return (
    <div 
      className="min-h-screen px-4 md:px-8 py-8" 
      style={{ background: "radial-gradient(circle, #FCFAEE 62%, #F88E8E 100%)" }}
    >
      <div className="max-w-5xl mx-auto flex items-center mb-10">
        <button onClick={() => router.back()} className="text-[#7D0A0A] hover:opacity-70 transition-all">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1
          className="flex-1 text-center text-xl font-black tracking-widest uppercase pr-8"
          style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          KEGIATAN YANG SEDANG BERLANGSUNG
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 justify-items-center">
          {kegiatanList.map((item) => (
            <CardKegiatan
              key={item.id}
              gambar_url={item.gambar_url}
              nama_penyelenggara={item.institusi?.nama_institusi ?? "-"}
              kuota={item.kuota}
              nama_event={item.nama_event}
              tanggal={item.tanggal}
              lokasi={item.lokasi}
              onDetail={() => router.push(`/Kegiatan/${item.id}`)}
            />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pb-8">
           <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-30" style={{ color: "#7D0A0A" }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
           </button>
        </div>
      )}
    </div>
  );
}