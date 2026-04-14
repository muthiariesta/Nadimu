"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, MapPin, Siren } from "lucide-react";
import { supabase } from "@/lib/supabase";

type PermintaanItem = {
  id: string;
  nama_pasien: string;
  golongan_darah: string;
  rhesus: string;
  kantong_terpenuhi: number;
  jumlah_kantong: number;
  kota: string;
  created_at: string;
  status: string;
};

type NotifikasiItem = {
  id: string;
  judul: string;
  isi: string;
  dibuat_pada: string;
};

type GolonganFilter = "Semua Gol." | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

const golonganList: GolonganFilter[] = ["Semua Gol.", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function ProgressBar({ terpenuhi, total }: { terpenuhi: number; total: number }) {
  const pct = total > 0 ? (terpenuhi / total) * 100 : 0;
  return (
    <div className="w-24 h-2 bg-[#000000]/25 rounded-none overflow-hidden">
      <div
        className="h-full bg-[#BF3131]/60 rounded-none transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function GolonganBadge({ golongan }: { golongan: string }) {
  return (
    <span className="text-xs font-bold text-[#7D0A0A] bg-[#FCFAEE] rounded-full px-6 py-4 min-w-[32px] text-center shadow-lg">
      {golongan}
    </span>
  );
}

function NotifikasiCard({
  item,
  onKonfirmasi,
  onTolak,
}: {
  item: NotifikasiItem;
  onKonfirmasi: (id: string) => void;
  onTolak: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-[#BF3131]/30 rounded-xl px-4 py-3 mb-3">
      <div className="flex items-start gap-3 flex-1">
        <Siren size={48} strokeWidth={1.5} color="#7D0A0A" className="mt-2 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-sm font-semibold text-[#7D0A0A]">{item.judul}</span>
            <span className="text-[12px] bg-[#7D0A0A] text-[#FCFAEE] rounded-full px-2.5 py-1">
              {new Date(item.dibuat_pada).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <span className="text-sm text-[#7D0A0A]">{item.isi}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 ml-4 flex-shrink-0">
        <button
          onClick={() => onKonfirmasi(item.id)}
          className="bg-[#7FB73C]/70 border border-[#2F4E09] hover:bg-[#E0FFBB] active:scale-95 transition-all duration-200 text-[#2F4E09] text-sm font-semibold px-6 py-1 rounded-xl"
        >
          Konfirmasi
        </button>
        <button
          onClick={() => onTolak(item.id)}
          className="bg-[#FCFAEE]/0 border border-[#7D0A0A] hover:bg-[#F88E8E] active:scale-95 transition-all duration-200 text-[#7D0A0A] text-sm font-semibold px-6 py-1 rounded-xl"
        >
          Tolak
        </button>
      </div>
    </div>
  );
}

function PermintaanCard({ item }: { item: PermintaanItem }) {
  const golongan = `${item.golongan_darah}${item.rhesus}`;
  const tanggal = new Date(item.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <div className="w-[93%] h-px bg-[#000000]/20 my-3 mx-auto" />
      <div className="flex items-center gap-4 mb-4 justify-center">
        <GolonganBadge golongan={golongan} />
        <div className="bg-[#FCFAEE] rounded-full px-5 py-3 flex items-center shadow-lg w-[800px] gap-3">
          <span className="text-sm font-semibold text-[#7D0A0A] w-[150px] shrink-0">{item.nama_pasien}</span>
          <div className="w-px h-8 bg-[#000000]/20 shrink-0" />
          <div className="flex items-center gap-4 px-4 w-[200px] shrink-0">
            <ProgressBar terpenuhi={item.kantong_terpenuhi} total={item.jumlah_kantong} />
            <span className="text-[14px] text-[#7D0A0A] font-semibold whitespace-nowrap">
              {item.kantong_terpenuhi}/{item.jumlah_kantong} Kantong
            </span>
          </div>
          <div className="w-px h-8 bg-[#000000]/20 shrink-0" />
          <div className="flex items-center gap-1 px-4 w-[180px] shrink-0">
            <MapPin size={20} color="#7D0A0A" className="shrink-0" />
            <span className="text-[14px] text-[#7D0A0A] font-semibold whitespace-nowrap">{item.kota}</span>
          </div>
          <div className="w-px h-8 bg-[#000000]/20 shrink-0" />
          <span className="text-[14px] text-[#7D0A0A] font-semibold w-[130px] shrink-0 px-4 text-right whitespace-nowrap">
            {tanggal}
          </span>
        </div>
      </div>
    </>
  );
}

export default function PermintaanAktif() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterGol, setFilterGol] = useState<GolonganFilter>("Semua Gol.");
  const [permintaanList, setPermintaanList] = useState<PermintaanItem[]>([]);
  const [notifikasiList, setNotifikasiList] = useState<NotifikasiItem[]>([]);
  const [permintaanSaya, setPermintaanSaya] = useState<PermintaanItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch permintaan aktif
      const { data: permintaan } = await supabase
        .from("permintaan_darah")
        .select("id, nama_pasien, golongan_darah, rhesus, jumlah_kantong, kantong_terpenuhi, kota, status, created_at")
        .eq("status", "aktif")
        .order("created_at", { ascending: false });

      if (permintaan) {
        setPermintaanList(permintaan);
        // Anggap permintaan pertama adalah milik user yang login
        // Sesuaikan dengan logika auth kalian
        setPermintaanSaya(permintaan[0] ?? null);
      }

      // Fetch notifikasi untuk user
      const { data: notifikasi } = await supabase
        .from("notifikasi")
        .select("id, judul, isi, dibuat_pada")
        .eq("sudah_dibaca", false)
        .order("dibuat_pada", { ascending: false })
        .limit(3);

      if (notifikasi) setNotifikasiList(notifikasi);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleKonfirmasi = async (id: string) => {
    await supabase
      .from("notifikasi")
      .update({ sudah_dibaca: true })
      .eq("id", id);
    setNotifikasiList((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTolak = async (id: string) => {
    await supabase
      .from("notifikasi")
      .update({ sudah_dibaca: true })
      .eq("id", id);
    setNotifikasiList((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = permintaanList.filter((p) => {
    const golongan = `${p.golongan_darah}${p.rhesus}`;
    const matchGol = filterGol === "Semua Gol." || golongan === filterGol;
    const matchSearch =
      p.nama_pasien.toLowerCase().includes(search.toLowerCase()) ||
      p.kota.toLowerCase().includes(search.toLowerCase());
    return matchGol && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAEE]">
        <div className="w-8 h-8 border-4 border-[#7D0A0A]/20 border-t-[#7D0A0A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-[Plus_Jakarta_Sans] bg-[linear-gradient(225deg,#e8b0b0_0%,#f0d8d8_30%,#FCFAEE_70%)] px-8 py-7">
      <div className="relative flex items-center justify-center mb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-0 p-1 hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={32} color="#7D0A0A" />
        </button>
        <h1 className="text-2xl font-extrabold tracking-[1.5px] text-[#7D0A0A]">
          PERMINTAAN AKTIF
        </h1>
      </div>

      {/* Permintaan Saya */}
      {permintaanSaya && (
        <div className="flex items-center gap-4 mb-4 justify-center">
          <GolonganBadge golongan={`${permintaanSaya.golongan_darah}${permintaanSaya.rhesus}`} />
          <div className="bg-[#FCFAEE] rounded-full px-5 py-3 flex items-center gap-8 shadow-lg w-[800px]">
            <span className="text-sm font-semibold text-[#7D0A0A]">Permintaan Saya</span>
            <div className="w-px h-8 bg-[#000000]/20" />
            <div className="flex items-center gap-4">
              <ProgressBar terpenuhi={permintaanSaya.kantong_terpenuhi} total={permintaanSaya.jumlah_kantong} />
              <span className="text-[14px] text-[#7D0A0A] font-semibold">
                {permintaanSaya.kantong_terpenuhi}/{permintaanSaya.jumlah_kantong} Kantong
              </span>
            </div>
            <div className="w-px h-8 bg-[#000000]/20" />
            <div className="flex items-center gap-1">
              <MapPin size={24} color="#7D0A0A" />
              <span className="text-[14px] text-[#7D0A0A] font-semibold">{permintaanSaya.kota}</span>
            </div>
            <div className="w-px h-8 bg-[#000000]/20" />
            <span className="text-[14px] text-[#7D0A0A] font-semibold">
              {new Date(permintaanSaya.created_at).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="bg-[#F88E8E]/30 rounded-3xl p-5 w-[1000px]">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#FCFAEE] rounded-2xl px-4 py-3 mb-4">
            <Search size={24} color="#7D0A0A" />
            <input
              type="text"
              placeholder="Cari nama atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#7D0A0A] placeholder-[#7D0A0A]/40"
            />
          </div>

          {/* Filter Golongan */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {golonganList.map((gol) => (
              <button
                key={gol}
                onClick={() => setFilterGol(gol)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  filterGol === gol
                    ? "bg-[#7D0A0A] text-[#FCFAEE] border-transparent shadow-lg"
                    : "bg-[#FCFAEE] text-[#7D0A0A] border-[rgba(125,10,10,0.2)] hover:bg-[#f0ccc8] shadow-lg"
                }`}
              >
                {gol}
              </button>
            ))}
          </div>

          {/* Notifikasi */}
          {notifikasiList.map((notif) => (
            <NotifikasiCard
              key={notif.id}
              item={notif}
              onKonfirmasi={handleKonfirmasi}
              onTolak={handleTolak}
            />
          ))}

          {/* List Permintaan */}
          <div className="flex flex-col">
            {filtered.length > 0 ? (
              filtered.map((item) => <PermintaanCard key={item.id} item={item} />)
            ) : (
              <p className="text-center text-sm text-[#7D0A0A] opacity-50 py-6">
                Tidak ada permintaan yang cocok.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
