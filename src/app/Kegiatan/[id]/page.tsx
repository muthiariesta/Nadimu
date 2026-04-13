"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CalendarDays, MapPin, Phone, ExternalLink, ArrowLeft } from "lucide-react";

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
  link_maps: string;
  institusi: { nama_institusi: string };
  pendaftaran_event: { pengguna_id: string }[];
}

function extractCoordsFromEmbed(embedUrl: string): { lat: string; lng: string } | null {
  if (!embedUrl) return null;
  const qMatch = embedUrl.match(/[?&]q=([^&]+)/);
  if (qMatch) {
    const q = decodeURIComponent(qMatch[1]);
    const coords = q.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
    if (coords) return { lat: coords[1], lng: coords[2] };
  }
  const pbMatch = embedUrl.match(/!3d(-?\d+\.?\d+)!4d(-?\d+\.?\d+)/);
  if (pbMatch) return { lat: pbMatch[1], lng: pbMatch[2] };
  const llMatch = embedUrl.match(/ll=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (llMatch) return { lat: llMatch[1], lng: llMatch[2] };
  return null;
}

function StaticMapCard({
  embedUrl,
  linkMaps,
  namaInstitusi,
  lokasi,
}: {
  embedUrl: string;
  linkMaps: string;
  namaInstitusi: string;
  lokasi: string;
}) {
  const coords = extractCoordsFromEmbed(embedUrl);
  const mapsLink =
    linkMaps ||
    (coords
      ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
      : `https://www.google.com/maps/search/${encodeURIComponent(lokasi || namaInstitusi)}`);

  return (
    <div className="w-full md:w-[280px] rounded-3xl overflow-hidden flex-shrink-0 flex flex-col border border-[#7D0A0A] bg-[#F7D4CC] font-[family-name:var(--font-plus-jakarta)]">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#7D0A0A]">
          <MapPin size={14} />
          <span className="text-xs font-bold truncate max-w-[180px]">
            {namaInstitusi || lokasi}
          </span>
        </div>
      </div>

      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-40 overflow-hidden"
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="160"
            className="border-0 pointer-events-none block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta lokasi"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#F7D4CC]">
            <MapPin size={32} className="text-[#7D0A0A] opacity-40" />
            <span className="text-xs text-center px-4 text-[#7D0A0A] opacity-50">
              {lokasi || namaInstitusi}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-200" />
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 bg-[#7D0A0A] text-[#FCFAEE]">
          <ExternalLink size={9} /> Buka Maps
        </div>
      </a>
    </div>
  );
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
          jam_mulai, jam_selesai, lokasi, kuota, nomor_wa, maps_embed, link_maps,
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

  const hasMapData = kegiatan.maps_embed || kegiatan.link_maps || kegiatan.lokasi;

  return (
    <div className="min-h-screen p-8 bg-[radial-gradient(ellipse_at_top_right,_#F88E8E_0%,_#FCFAEE_50%)] font-[family-name:var(--font-plus-jakarta)] antialiased">
      <div className="relative flex items-center justify-center mb-8">
        <button 
          onClick={() => router.back()} 
          className="absolute left-0 p-2 text-[#7D0A0A] hover:opacity-60 transition-all rounded-full"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </button>
        
        <h1 className="text-2xl font-black text-[#7D0A0A] text-center uppercase">
          {kegiatan.nama_event}
        </h1>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-[400px] aspect-video rounded-2xl overflow-hidden shadow-xl">
          <img
            src={kegiatan.gambar_url || "/empty-img.png"}
            alt={kegiatan.nama_event}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 mb-6 text-[#7D0A0A]">
        <CalendarDays size={20} strokeWidth={2.5} />
        <p className="text-base font-bold">
          {formatTanggal(kegiatan.tanggal)}  |  {formatJam(kegiatan.jam_mulai)} - {formatJam(kegiatan.jam_selesai)}
        </p>
      </div>

      <p className="text-center text-sm leading-relaxed max-w-2xl mx-auto mb-10 text-[#5a2a2a] font-medium">
        {kegiatan.deskripsi}
      </p>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto justify-center items-stretch">
        <div className="flex-1 rounded-3xl p-8 flex flex-col gap-4 shadow-xl border border-[#7D0A0A] bg-[#F7D4CC]">
          <div className="flex justify-between items-center text-[#7D0A0A]">
            <span className="text-sm font-bold">Kuota Peserta</span>
            <span className="text-sm font-black">{pesertaTerdaftar}/{kegiatan.kuota}</span>
          </div>
          
          <div className="w-full h-3 rounded-full bg-[#E0C5BC] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-[#7D0A0A]"
              style={{ width: `${progressPersen}%` }}
            />
          </div>
          <p className="text-xs font-bold text-[#5a2a2a]">
            {slotTersedia} slot tersedia
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={() => { if (!sudahDaftar) router.push(`/Kegiatan/${id}/prescreening`); }}
              disabled={slotTersedia === 0}
              className={`flex-1 min-w-[120px] py-4 rounded-full font-black text-xs tracking-widest transition-all active:scale-95 disabled:opacity-40 
                ${sudahDaftar 
                  ? 'bg-[#E0C5BC] text-[#7D0A0A] cursor-default' 
                  : 'bg-[#7D0A0A] text-[#FCFAEE] hover:bg-[#F88E8E]'}`}
            >
              {sudahDaftar ? "TERDAFTAR" : "DAFTAR"}
            </button>

            {kegiatan.nomor_wa && (
              <a
                href={`https://wa.me/${kegiatan.nomor_wa.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] py-4 rounded-full font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#7D0A0A] text-[#7D0A0A] hover:bg-[#F88E8E] hover:text-[#FCFAEE]"
              >
                <Phone size={14} /> NARAHUBUNG
              </a>
            )}
          </div>
        </div>

        {hasMapData && (
          <StaticMapCard
            embedUrl={kegiatan.maps_embed}
            linkMaps={kegiatan.link_maps}
            namaInstitusi={kegiatan.institusi?.nama_institusi}
            lokasi={kegiatan.lokasi}
          />
        )}
      </div>
    </div>
  );
}