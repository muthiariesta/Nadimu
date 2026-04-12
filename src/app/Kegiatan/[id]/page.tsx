"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { CalendarDays, MapPin, Phone } from "lucide-react";

interface KegiatanDetail {
  id: string;
  nama_event: string;
  deskripsi: string;
  gambar_url: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  kuota: number;
  nomor_wa: string;
  maps_embed: string;
  institusi: { nama_institusi: string };
  pendaftaran_event: { pengguna_id: string }[];
}

export default function DetailKegiatanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [kegiatan, setKegiatan] = useState<KegiatanDetail | null>(null);
  const [sudahDaftar, setSudahDaftar] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await supabase
        .from("event_donor")
        .select(`
          id, nama_event, deskripsi, gambar_url, tanggal,
          jam_mulai, jam_selesai, lokasi, kuota, nomor_wa, maps_embed,
          institusi:penyelenggara_id(nama_institusi),
          pendaftaran_event(pengguna_id)
        `)
        .eq("id", id)
        .single();

      if (data) {
        setKegiatan(data as unknown as KegiatanDetail);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const sudah = (data.pendaftaran_event as { pengguna_id: string }[])
            .some((p) => p.pengguna_id === user.id);
          setSudahDaftar(sudah);
        }
      }
    };
    fetchDetail();
  }, [id]);

  if (!kegiatan) return null;

  const pesertaTerdaftar = kegiatan.pendaftaran_event?.length ?? 0;
  const progressPersen = Math.min((pesertaTerdaftar / kegiatan.kuota) * 100, 100);
  const slotTersedia = kegiatan.kuota - pesertaTerdaftar;
  const formatJam = (jam: string) => jam?.slice(0, 5) ?? "";
  const formatTanggal = (tgl: string) => {
    if (!tgl) return "";
    return new Date(tgl).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
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
          {kegiatan.nama_event.toUpperCase()}
        </h1>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-[380px] h-[220px] rounded-2xl overflow-hidden">
          <Image src={kegiatan.gambar_url || "/empty-img.png"} alt={kegiatan.nama_event} fill className="object-cover" />
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 mb-4">
        <CalendarDays size={18} color="#7D0A0A" />
        <p className="text-sm font-semibold" style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {formatTanggal(kegiatan.tanggal)} &nbsp;|&nbsp; {formatJam(kegiatan.jam_mulai)} - {formatJam(kegiatan.jam_selesai)}
        </p>
      </div>

      <p className="text-center text-sm leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: "#5a2a2a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {kegiatan.deskripsi}
      </p>

      <div className="flex gap-6 max-w-3xl mx-auto"> 
        <div className="flex-1 rounded-3xl p-5 flex flex-col gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" style={{ border: "1.5px solid #7D0A0A", background: "#F7D4CC" }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold" style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kuota Peserta</span>
            <span className="text-sm font-black" style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pesertaTerdaftar}/{kegiatan.kuota}</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#E0C5BC" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPersen}%`, backgroundColor: "#7D0A0A" }} />
          </div>
          <p className="text-xs" style={{ color: "#5a2a2a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{slotTersedia} slot tersedia</p>

          <div className="flex gap-3 mt-1">
            <button
              onClick={() => { if (!sudahDaftar) router.push(`/Kegiatan/${id}/prescreening`); }}
              disabled={slotTersedia === 0}
              className="flex-1 py-3 rounded-full font-black text-xs tracking-widest transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
              style={{
                backgroundColor: sudahDaftar ? "#E0C5BC" : "#7D0A0A",
                color: sudahDaftar ? "#7D0A0A" : "#FCFAEE",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "0.15em",
                cursor: sudahDaftar ? "default" : "pointer",
              }}
            >
              {sudahDaftar ? "TERDAFTAR" : "DAFTAR"}
            </button>

            {kegiatan.nomor_wa && (
              <a
                href={`https://wa.me/${kegiatan.nomor_wa.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-full font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                style={{ border: "1.5px solid #7D0A0A", color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.1em" }}
              >
                <Phone size={14} /> NARAHUBUNG
              </a>
            )}
          </div>
        </div>

        {kegiatan.maps_embed && (
          <div className="w-[280px] rounded-3xl overflow-hidden flex flex-col" style={{ border: "1.5px solid #E0C5BC" }}>
            <div className="px-4 pt-3 pb-2 flex items-center gap-2">
              <MapPin size={14} color="#7D0A0A" />
              <span className="text-xs font-bold" style={{ color: "#7D0A0A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {kegiatan.institusi?.nama_institusi}
              </span>
            </div>
            <iframe src={kegiatan.maps_embed} width="100%" height="160" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
      </div>
    </div>
  );
}