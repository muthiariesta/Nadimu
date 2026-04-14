"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RiwayatDonorItem {
  id: string;
  lokasi: string;
  tanggal: string;
  poin: number;
}

function RiwayatDonorCard({ item }: { item: RiwayatDonorItem }) {
  return (
    <div className="flex items-center justify-between bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl px-6 py-4">
      <div className="flex flex-col gap-1">
        <span className="text-md font-bold text-[#7D0A0A]">{item.lokasi}</span>
        <span className="text-sm font-base text-[#7D0A0A]">{item.tanggal}</span>
      </div>
      <span className="text-sm font-bold text-[#4A7811]">+{item.poin} poin</span>
    </div>
  );
}

export default function RiwayatDonorPage() {
  const router = useRouter();
  const [riwayatList, setRiwayatList] = useState<RiwayatDonorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("riwayat_donor")
        .select("id, tanggal_donor, poin_didapat, institusi:pmi_id(nama_institusi)")
        .eq("pengguna_id", user.id)
        .order("tanggal_donor", { ascending: false });

      if (data) {
        setRiwayatList(data.map((r: any) => ({
          id: r.id,
          lokasi: Array.isArray(r.institusi)
            ? r.institusi[0]?.nama_institusi ?? "-"
            : r.institusi?.nama_institusi ?? "-",
          tanggal: new Date(r.tanggal_donor).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric"
          }),
          poin: r.poin_didapat,
        })));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
      <div className="w-8 h-8 border-4 border-[#7D0A0A]/20 border-t-[#7D0A0A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] bg-[#F5EBE0] flex flex-col px-10 py-8">
      <button
        onClick={() => router.back()}
        className="self-start text-[#7D0A0A] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer mb-4">
        <ArrowLeft size={32} color="#7D0A0A" />
      </button>
      <h1 className="text-center text-2xl font-extrabold text-[#7D0A0A] tracking-[1px] mb-8">
        RIWAYAT DONOR
      </h1>

      <div className="flex flex-col gap-3 w-full max-w-xl mx-auto">
        {riwayatList.length > 0 ? (
          riwayatList.map((item) => (
            <RiwayatDonorCard key={item.id} item={item} />
          ))
        ) : (
          <div className="flex items-center justify-center bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl px-6 py-4">
            <span className="text-md text-[#7D0A0A]/60">Belum ada riwayat donor</span>
          </div>
        )}
      </div>
    </div>
  );
}