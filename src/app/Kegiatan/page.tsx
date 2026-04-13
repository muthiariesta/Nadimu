"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle,_#FCFAEE_62%,_#F88E8E_100%)] px-8 py-8 font-[family-name:var(--font-plus-jakarta)] antialiased">
      <div className="relative flex items-center justify-center mb-10">
        <button 
          onClick={() => router.back()} 
          className="absolute left-0 p-1 text-[#7D0A0A] hover:opacity-60 transition-all"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </button>
        
        <h1 className="text-2xl font-black tracking-normal text-[#7D0A0A] text-center max-w-[80%] uppercase">
          KEGIATAN YANG SEDANG BERLANGSUNG
        </h1>
      </div>

      <div className="max-w-6xl mx-auto">
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
        <div className="flex items-center justify-center gap-4 mt-12 pb-8">
          <button 
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} 
            disabled={currentPage === 1} 
            className="p-2 text-[#7D0A0A] disabled:opacity-30 hover:bg-[#F88E8E] rounded-full transition-all"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          
          <span className="text-lg font-bold text-[#7D0A0A]">
            {currentPage} / {totalPages}
          </span>

          <button 
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} 
            disabled={currentPage === totalPages} 
            className="p-2 text-[#7D0A0A] disabled:opacity-30 hover:bg-[#F88E8E] rounded-full transition-all"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}