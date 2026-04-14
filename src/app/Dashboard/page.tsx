"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Cross, Map, UserCircle, Newspaper, Calendar, ClipboardList, LogOut, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";

interface KegiatanItem {
  id: string;
  nama: string;
  penyelenggara: string;
  tanggal: string;
  bulanTahun: string;
  lokasi: string;
}

interface RiwayatDonorItem {
  nama: string;
  tanggal: string;
  bulanTahun: string;
  lokasi1: string;
}

interface StokDarahItem {
  golongan: string;
  kantong: number;
  maxKantong: number;
}

interface PermintaanAktifItem {
  id: string;
  golongan: string;
  nama: string;
  lokasi: string;
  tanggal: string;
}

const navItems = [
  { label: "Beranda",          icon: Home,          href: "/Dashboard" },
  { label: "Layanan",          icon: Cross,         href: "/Permintaan" },
  { label: "Persebaran",       icon: Map,           href: "/Petastok" },
  { label: "Komunitas",        icon: UserCircle,    href: "/Komunitas" },
  { label: "Berita",           icon: Newspaper,     href: "/Berita" },
  { label: "Kegiatan",         icon: Calendar,      href: "/Kegiatan" },
  { label: "Permintaan Aktif", icon: ClipboardList, href: "/Permintaanaktif" },
];

function StokDarahBar({ item }: { item: StokDarahItem }) {
  const pct = item.maxKantong > 0 ? (item.kantong / item.maxKantong) * 100 : 0;
  const barColor =
    pct <= 40 ? "bg-[#BE6764]" :
    pct <= 70 ? "bg-[#F2E076]" :
                "bg-[#7FB73C]/50";
  return (
    <div className="flex items-center gap-3">
      <span className="text-md font-semibold text-[#7D0A0A] w-6">{item.golongan}</span>
      <div className="flex-1 h-4 bg-[#000000]/10 rounded-none overflow-hidden">
        <div className={`h-full ${barColor} rounded-none transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-[#7D0A0A] w-25 text-right">{item.kantong} Kantong</span>
    </div>
  );
}

function GolonganBadge({ golongan }: { golongan: string }) {
  return (
    <span className="text-lg font-bold text-[#FCFAEE] bg-[#7D0A0A] rounded-lg w-10 h-10 flex items-center justify-center shrink-0">
      {golongan}
    </span>
  );
}

function PermintaanRow({ item, onKonfirmasi }: { item: PermintaanAktifItem; onKonfirmasi: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 bg-[#F88E8E]/50 rounded-xl p-1">
      <GolonganBadge golongan={item.golongan} />
      <div className="flex flex-col flex-1">
        <span className="text-md font-bold text-[#7D0A0A]">{item.nama}</span>
        <span className="text-md text-[#7D0A0A]/70">{item.lokasi}</span>
      </div>
      <span className="text-md text-[#7D0A0A] font-semibold whitespace-nowrap">{item.tanggal}</span>
      <button
        onClick={() => onKonfirmasi(item.id)}
        className="bg-[#7D0A0A] text-[#FCFAEE] text-md font-semibold px-4 py-1.5 rounded-xl hover:bg-[#F88E8E] transition-colors whitespace-nowrap">
        Konfirmasi
      </button>
    </div>
  );
}

export default function BerandaPage() {
  const router = useRouter();
  const { profile, loading } = useProfile();

  const [kegiatanIndex, setKegiatanIndex] = useState(0);
  const [kegiatanList, setKegiatanList] = useState<KegiatanItem[]>([]);
  const [riwayatDonor, setRiwayatDonor] = useState<RiwayatDonorItem | null>(null);
  const [stokDarah, setStokDarah] = useState<StokDarahItem[]>([]);
  const [permintaanAktif, setPermintaanAktif] = useState<PermintaanAktifItem[]>([]);
  const [sertifikatUrl, setSertifikatUrl] = useState<string | null>(null);

  useEffect(() => {
    if (kegiatanList.length === 0) return;
    const interval = setInterval(() => {
      setKegiatanIndex((i) => (i === kegiatanList.length - 1 ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [kegiatanList.length]);

  useEffect(() => {
    if (!profile) return;
    const fetchAll = async () => {
      // Kegiatan
      const { data: kegiatan } = await supabase
        .from("event_donor")
        .select("id, nama_event, tanggal, lokasi, institusi:penyelenggara_id(nama_institusi)")
        .eq("status", "aktif")
        .limit(3);
      if (kegiatan) {
        setKegiatanList(kegiatan.map((k: any) => ({
          id: k.id,
          nama: k.nama_event,
          penyelenggara: Array.isArray(k.institusi)
            ? k.institusi[0]?.nama_institusi ?? "-"
            : k.institusi?.nama_institusi ?? "-",
          tanggal: new Date(k.tanggal).getDate().toString(),
          bulanTahun: new Date(k.tanggal).toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
          lokasi: k.lokasi,
        })));
      }

      // Riwayat donor
      const { data: riwayat } = await supabase
        .from("riwayat_donor")
        .select("id, tanggal_donor, poin_didapat, sertifikat, institusi:pmi_id(nama_institusi), event_donor:event_id(nama_event)")
        .eq("pengguna_id", profile.id)
        .order("tanggal_donor", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (riwayat) {
        const institusi = Array.isArray(riwayat.institusi) ? riwayat.institusi[0] : riwayat.institusi;
        const event = Array.isArray(riwayat.event_donor) ? riwayat.event_donor[0] : riwayat.event_donor;
        setRiwayatDonor({
          nama: event?.nama_event ?? "-",           // ← nama event di atas
          lokasi1: institusi?.nama_institusi ?? "-", // ← nama PMI di bawah
          tanggal: new Date(riwayat.tanggal_donor).getDate().toString(),
          bulanTahun: new Date(riwayat.tanggal_donor).toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
        });
        setSertifikatUrl(riwayat.sertifikat ?? null);
      }

      // Stok darah
      const { data: stok } = await supabase
        .from("stok_darah")
        .select("golongan_darah, jumlah_kantong, institusi:pmi_id(kota)");
      if (stok) {
        const kotaStok = stok.filter((s: any) =>
          Array.isArray(s.institusi)
            ? s.institusi[0]?.kota === profile.kota
            : s.institusi?.kota === profile.kota
        );
        const grouped: Record<string, number> = {};
        kotaStok.forEach((s: any) => {
          grouped[s.golongan_darah] = (grouped[s.golongan_darah] ?? 0) + s.jumlah_kantong;
        });
        setStokDarah(Object.entries(grouped).map(([golongan, kantong]) => ({
          golongan, kantong, maxKantong: 100,
        })));
      }

      // Permintaan aktif
      const { data: permintaan } = await supabase
        .from("permintaan_darah")
        .select("id, nama_pasien, golongan_darah, rhesus, rs_pasien, created_at")
        .eq("status", "aktif")
        .limit(3);
      if (permintaan) {
        setPermintaanAktif(permintaan.map((p: any) => ({
          id: p.id,
          golongan: `${p.golongan_darah}${p.rhesus === "positif" ? "+" : "-"}`,
          nama: p.nama_pasien,
          lokasi: p.rs_pasien,
          tanggal: new Date(p.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        })));
      }
    };
    fetchAll();
  }, [profile]);

  const handleKonfirmasi = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from("respon_permintaan").insert({
      permintaan_id: id,
      pendonor_id: session.user.id,
      status: "bersedia",
    });
    alert("Konfirmasi berhasil!");
  };

  const handleKeluar = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAEE]">
        <div className="w-8 h-8 border-4 border-[#7D0A0A]/20 border-t-[#7D0A0A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] flex bg-[#FCFAEE]">
      <aside className="w-65 bg-[#F88E8E]/35 flex flex-col py-8 px-5 gap-6 shadow-md shrink-0 pl-3">
        <div className="flex items-center gap-2 mb-4 pl-8">
          <img src="/asset/logo.png" alt="Donor Darah" className="w-8 h-full object-cover object-center block brightness-95" />
          <span className="text-2xl font-extrabold text-[#7D0A0A]">Nadimu</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1 pl-3">
          {navItems.map((nav) => (
            <button
              key={nav.label}
              onClick={() => router.push(nav.href)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-md font-semibold text-[#7D0A0A] hover:bg-[#F88E8E]/60 transition-colors text-left">
              <nav.icon size={32} />
              {nav.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleKeluar}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-md font-semibold text-[#7D0A0A] hover:bg-[#F88E8E]/60 transition-colors pl-6">
          <LogOut size={32} />
          Keluar
        </button>
      </aside>

      <main className="flex-1 px-8 py-7 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-[#7D0A0A] tracking-wide">
            SELAMAT DATANG DI NADIMU!
          </h1>
          <div
            className="flex items-center gap-3 bg-[#FCFAEE] rounded-2xl px-4 py-2 cursor-pointer hover:bg-[#F7D4CC] transition-colors"
            onClick={() => router.push("/profil")}
          >
           {profile?.foto_url ? (
              <img 
                src={profile.foto_url} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#7D0A0A]" 
              />
            ) : (
              <UserCircle size={48} color="#7D0A0A" />
            )}
            
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#7D0A0A]">{profile?.nama_lengkap ?? "-"}</span>
              <span className="text-md text-[#7D0A0A]/70">{profile?.total_poin ?? 0} Poin</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_5fr] gap-3 flex-1">

          {/* Kegiatan Terdekat */}
<div className="bg-[#FCFAEE] border border-[#7D0A0A] rounded-2xl p-5 gap-2 min-w-[350px]">
  <h2 className="text-2xl font-extrabold text-[#7D0A0A] tracking-wider text-center mb-2">KEGIATAN TERDEKAT</h2>
  
  <div className="flex flex-col gap-4 flex-1">
    {kegiatanList.slice(kegiatanIndex, kegiatanIndex + 2).map((k, i) => (
      <div
        key={k.id}
        className={`bg-[#F7D4CC] rounded-xl px-4 py-2 flex flex-col gap-2 flex-1 transition-all duration-500 ${
          i === 0 ? "ring-2 ring-[#7D0A0A]" : "opacity-50"
        }`}>
        <span className="text-lg font-bold text-[#7D0A0A] text-center">{k.nama}</span>
        <div className="flex items-center gap-3 w-full">
          <div className="bg-[#7D0A0A] text-[#FCFAEE] rounded-2xl px-3 py-2 text-center w-[90px] shrink-0">
            <div className="text-2xl font-extrabold leading-none">{k.tanggal}</div>
            <div className="text-xs mt-1">{k.bulanTahun}</div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-md font-bold text-[#7D0A0A]">{k.penyelenggara}</span>
            <span className="text-md text-[#7D0A0A]/70">{k.lokasi}</span>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Dots */}
  <div className="flex justify-center gap-2 mt-3">
    {kegiatanList.map((_, i) => (
      <button
        key={i}
        onClick={() => setKegiatanIndex(i)}
        className={`h-2 rounded-full transition-all duration-300 ${
          i === kegiatanIndex ? "bg-[#7D0A0A] w-4" : "bg-[#7D0A0A]/30 w-2"
        }`} />
    ))}
  </div>
</div>

          {/* Stok Darah */}
          <div className="bg-[#F88E8E]/35 rounded-2xl p-5 flex flex-col gap-4">
            <h2 className="text-2xl font-extrabold text-[#7D0A0A] tracking-wider text-center">STOK DARAH</h2>
            <div className="flex items-center gap-3 mb-1">
              <MapPin size={32} color="#7D0A0A" />
              <span className="text-2xl font-bold text-[#7D0A0A]">{(profile?.kota ?? "-").toUpperCase()}</span>
            </div>
            <div className="flex flex-col gap-6">
              {stokDarah.map((item) => (
                <StokDarahBar key={item.golongan} item={item} />
              ))}
            </div>
          </div>

          {/* Riwayat Donor */}
          <div className="bg-[#FCFAEE] border border-[#7D0A0A] rounded-2xl p-5 flex flex-col gap-1.5">
            <h2 className="text-xl font-extrabold text-[#7D0A0A] tracking-wider text-center">RIWAYAT DONOR DARAH</h2>
            <div className="bg-[#F88E8E]/35 flex flex-col items-center gap-1.5 rounded-2xl px-4 py-2">
              <span className="text-lg font-bold text-[#7D0A0A]">{riwayatDonor?.nama ?? "-"}</span>
              <div className="flex items-center gap-4 w-full">
                <div className="bg-[#7D0A0A] text-[#FCFAEE] rounded-2xl px-4 py-3 text-center w-[90px]">
                  <div className="text-2xl font-extrabold leading-none">{riwayatDonor?.tanggal ?? "-"}</div>
                  <div className="text-xs mt-1">{riwayatDonor?.bulanTahun ?? ""}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-[#7D0A0A]">{riwayatDonor?.lokasi1 ?? "-"}</span>
                </div>
              </div>
              <button
                onClick={() => sertifikatUrl && window.open(sertifikatUrl, "_blank")}
                disabled={!sertifikatUrl}
                className="bg-[#7D0A0A] text-[#FCFAEE] text-md font-semibold px-8 py-1.5 rounded-xl hover:bg-[#F88E8E] transition-colors mt-1 w-full disabled:opacity-40">
                {sertifikatUrl ? "Lihat Sertifikat" : "Sertifikat Belum Tersedia"}
              </button>
            </div>
          </div>

          {/* Permintaan Aktif */}
          <div className="bg-[#F88E8E]/35 rounded-2xl p-2 flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold text-[#7D0A0A] tracking-wider text-center">PERMINTAAN AKTIF</h2>
            <div className="flex flex-col gap-2.5">
              {permintaanAktif.map((item) => (
                <PermintaanRow key={item.id} item={item} onKonfirmasi={handleKonfirmasi} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}