"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

type HasilItem = {
  id: string;
  nama: string;
  keterangan: string;
};

function HasilCard({ item, onHubungkan }: { item: HasilItem; onHubungkan: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between bg-[#F88E8E]/50 rounded-2xl px-6 py-4">
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-[#7D0A0A]">{item.nama}</span>
        <span className="text-sm text-[#7D0A0A]">{item.keterangan}</span>
      </div>
      <button
        onClick={() => onHubungkan(item.id)}
        className="bg-[#7D0A0A] hover:bg-[#F88E8E] active:scale-95 transition-all duration-200 text-[#FCFAEE] font-semibold text-sm px-6 py-2 rounded-xl"
      >
        Hubungkan
      </button>
    </div>
  );
}

export default function Hasil() {
  const router = useRouter();
  const [hasil, setHasil] = useState<HasilItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHasil = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ambil permintaan aktif terbaru milik user
      const { data: permintaan } = await supabase
        .from("permintaan_darah")
        .select("id, golongan_darah, rhesus, kota")
        .eq("pencari_id", user.id)
        .eq("status", "aktif")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!permintaan) { setLoading(false); return; }

      const results: HasilItem[] = [];

      // 1. Cari pendonor yang cocok dari tabel profil
      const { data: pendonor } = await supabase
        .from("profil")
        .select("id, nama_lengkap, kota")
        .eq("golongan_darah", permintaan.golongan_darah)
        .eq("rhesus", permintaan.rhesus)
        .eq("kota", permintaan.kota)
        .eq("aktif_pendonor", true)
        .neq("id", user.id);

      if (pendonor) {
        pendonor.forEach((p) => {
          results.push({
            id: `pendonor-${p.id}`,
            nama: p.nama_lengkap ?? "-",
            keterangan: p.kota ?? "-",
          });
        });
      }

      // 2. Cari stok darah dari PMI yang kotanya cocok
      const { data: institusiList } = await supabase
        .from("institusi")
        .select("id, nama_institusi, kota")
        .ilike("kota", `%${permintaan.kota}%`)
        .eq("status", "aktif");

      if (institusiList && institusiList.length > 0) {
        const institusiIds = institusiList.map((i) => i.id);
        const institusiMap: Record<string, string> = {};
        institusiList.forEach((i) => { institusiMap[i.id] = i.nama_institusi; });

        const { data: stok } = await supabase
          .from("stok_darah")
          .select("pmi_id, jumlah_kantong")
          .eq("golongan_darah", permintaan.golongan_darah)
          .eq("rhesus", permintaan.rhesus)
          .in("pmi_id", institusiIds)
          .gt("jumlah_kantong", 0);

        if (stok) {
          stok.forEach((s) => {
            results.push({
              id: `pmi-${s.pmi_id}`,
              nama: institusiMap[s.pmi_id] ?? "PMI",
              keterangan: `Stok: ${s.jumlah_kantong} Kantong`,
            });
          });
        }
      }

      setHasil(results);
      setLoading(false);
    };

    fetchHasil();
  }, []);

  const handleHubungkan = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isPendonor = id.startsWith("pendonor-");
    const realId = id.replace("pendonor-", "").replace("pmi-", "");

    // Ambil permintaan aktif terbaru
    const { data: permintaan } = await supabase
      .from("permintaan_darah")
      .select("id")
      .eq("pencari_id", user.id)
      .eq("status", "aktif")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!permintaan) return;

    if (isPendonor) {
      await supabase.from("respon_permintaan").upsert({
        permintaan_id: permintaan.id,
        pendonor_id: realId,
        status: "menunggu",
        sudah_dihubungkan: true,
        dihubungkan_pada: new Date().toISOString(),
      });
    }

    alert(`Berhasil menghubungkan! ${isPendonor ? "Pendonor" : "PMI"} akan segera dihubungi.`);
  };

  return (
    <div className="min-h-screen w-full font-[Plus_Jakarta_Sans] bg-[#FCFAEE] px-10 py-8">
      <div className="relative flex items-center justify-center mb-10">
        <button
          onClick={() => router.back()}
          className="absolute left-0 p-1 hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={32} color="#7D0A0A" />
        </button>
        <h1 className="text-3xl font-extrabold tracking-[1.5px] text-[#7D0A0A]">HASIL</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-[#7D0A0A] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {hasil.length > 0 ? (
            hasil.map((item) => (
              <HasilCard key={item.id} item={item} onHubungkan={handleHubungkan} />
            ))
          ) : (
            <p className="text-center text-[#7D0A0A] opacity-60 mt-10 text-xl">
              Tidak ada pendonor atau stok darah yang cocok ditemukan.
            </p>
          )}
        </div>
      )}
    </div>
  );
}