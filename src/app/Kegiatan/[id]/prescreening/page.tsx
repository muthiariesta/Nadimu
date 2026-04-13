"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
    <div className="min-h-screen px-8 py-6" style={{ background: "radial-gradient(ellipse at top right, #F88E8E 0%, #FCFAEE 50%)" }}>
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="text-[#7D0A0A]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-xl font-black tracking-widest pr-6" style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          PENGECEKAN KONDISI
        </h1>
      </div>

      <p className="text-center text-sm mb-6" style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Pastikan Anda Memenuhi Syarat Berikut Sebelum Melakukan Donor Darah
      </p>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative w-full h-8 rounded-full overflow-hidden" style={{ backgroundColor: "#E0C5BC" }}>
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${persen}%`, backgroundColor: "#7D0A0A" }} />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
            style={{ color: persen > 85 ? "#FCFAEE" : "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {persen}%
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-4 mb-10">
        {CHECKLIST_ITEMS.map((item, i) => (
          <label key={i} className="flex items-center gap-4 cursor-pointer" onClick={() => toggle(i)}>
            <div
              className="shrink-0 w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: checked[i] ? "#7D0A0A" : "rgba(234,123,123,0.35)",
                border: checked[i] ? "none" : "1.5px solid #E0C5BC",
              }}
            >
              {checked[i] && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FCFAEE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span
              className="text-sm"
              style={{
                color: checked[i] ? "#7D0A0A" : "#5a2a2a",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: checked[i] ? "600" : "400",
              }}
            >
              {item}
            </span>
          </label>
        ))}
      </div>

      <div className="flex justify-center pb-8">
        <button
          onClick={handleKonfirmasi}
          disabled={!semuaChecked || loading}
          className="px-16 py-4 rounded-full font-black tracking-widest text-sm transition-all duration-200 active:scale-95"
          style={{
            backgroundColor: semuaChecked ? "#7D0A0A" : "rgba(234,123,123,0.4)",
            color: semuaChecked ? "#FCFAEE" : "#7D0A0A",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "0.2em",
            cursor: semuaChecked ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "MEMPROSES..." : "KONFIRMASI"}
        </button>
      </div>
    </div>
  );
}