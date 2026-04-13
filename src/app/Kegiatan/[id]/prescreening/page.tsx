"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Check } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Usia 17–60 Tahun",
  "Berat Badan > 45 Kg",
  "Kondisi Tubuh Sehat",
  "Tidak Sedang Mengonsumsi Obat Tertentu",
  "Tidak Memiliki Riwayat Penyakit Menular",
  "Tidak Sedang Hamil Atau Menyusui",
  "Tidak Menjalani Operasi Atau Tindakan Medis Lainnya Selama Beberapa Bulan Terakhir",
  "Tidak Melakukan Tato, Tindik, Atau Prosedur Serupa Selama Beberapa Bulan Terakhir",
  "Sudah 2–3 Bulan Sejak Terakhir Kali Donor Darah",
  "Tidur Minimal 5–6 Jam",
];


export default function PreScreeningPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [checked, setChecked] = useState<boolean[]>(Array(CHECKLIST_ITEMS.length).fill(false));
  const [loading, setLoading] = useState(false);

  const jumlahChecked = checked.filter(Boolean).length;
  const total = CHECKLIST_ITEMS.length;
  const persen = Math.round((jumlahChecked / total) * 100);
  const semuaChecked = jumlahChecked === total;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const handleKonfirmasi = async () => {
    if (!semuaChecked) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { error } = await supabase.from("pendaftaran_event").insert({
      event_id: id,
      pengguna_id: user.id,
      status_kehadiran: "terdaftar",
    });

    setLoading(false);
    if (!error) router.push(`/Kegiatan/${id}`);
  };

  return (
    <div className="min-h-screen px-8 py-8 bg-[radial-gradient(ellipse_at_top_right,_#F88E8E_0%,_#FCFAEE_50%)] font-[family-name:var(--font-plus-jakarta)] antialiased">
      <div className="relative flex items-center justify-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="absolute left-0 p-2 text-[#7D0A0A] hover:bg-[#F88E8E] rounded-full transition-all"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </button>
        <h1 className="text-2xl font-black text-[#7D0A0A] uppercase">
          PENGECEKAN KONDISI
        </h1>
      </div>

      <p className="text-center text-sm mb-8 text-[#7D0A0A] font-medium">
        Pastikan Anda Memenuhi Syarat Berikut Sebelum Melakukan Donor Darah
      </p>

      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative w-full h-9 rounded-full bg-[#F88E8E]/30 p-1.5 border border-[#F88E8E]/20">
          <div 
            className="h-full rounded-full bg-[#7D0A0A] transition-all duration-500 ease-out"
            style={{ width: `${persen}%` }}
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-black text-[#7D0A0A]">
            {persen}%
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-2.5 mb-10">
        {CHECKLIST_ITEMS.map((item, i) => (
          <div 
            key={i} 
            className="flex items-center gap-4 cursor-pointer group py-0.5" 
            onClick={() => toggle(i)}
          >
            <div
              className="shrink-0 w-7 h-7 rounded-full bg-[#EA7B7B]/20 border border-[#7D0A0A]/10 transition-all duration-200 flex items-center justify-center"
            >
              {checked[i] && (
                <Check size={18} strokeWidth={4} className="text-[#7D0A0A]" />
              )}
            </div>
            
            <span className={`text-sm leading-tight transition-all duration-200 ${checked[i] ? 'text-[#7D0A0A] font-bold' : 'text-[#5a2a2a]'}`}>
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center pb-10">
        <button
          onClick={handleKonfirmasi}
          disabled={!semuaChecked || loading}
          className={`px-16 py-4 rounded-full font-black text-sm transition-all duration-200 active:scale-95
            ${semuaChecked 
              ? 'bg-[#7D0A0A] text-[#FCFAEE] hover:bg-[#F88E8E] cursor-pointer shadow-lg' 
              : 'bg-[#EA7B7B]/40 text-[#7D0A0A]/50 cursor-not-allowed'}`}
        >
          {loading ? "MEMPROSES..." : "KONFIRMASI"}
        </button>
      </div>
    </div>
  );
}