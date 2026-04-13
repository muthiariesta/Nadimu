"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, MapPin, Siren} from "lucide-react";

type PermintaanItem = {
  id: string;
  nama: string;
  golongan: string;
  terpenuhi: number;
  total: number;
  lokasi: string;
  tanggal: string;
};

type NotifikasiItem = {
  id: string;
  golongan: string;
  pesan: string;
  tanggal: string;
  lokasi: string;
};

type GolonganFilter = "Semua Gol." | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

const permintaanSaya = {
  golongan: "A+",
  terpenuhi: 2,
  total: 5,
  lokasi: "Kota Bekasi",
  tanggal: "27 Februari 2026",
};

const dummyNotifikasi: NotifikasiItem[] = [
  {
    id: "n1",
    golongan: "O+",
    pesan: "Kim Jong Un membutuhkan 2 kantong O+ di RS CiptoMangunkusumo",
    tanggal: "Diajukan 14 Maret 2026",
    lokasi: "Kab. Bekasi",
  },
];

const dummyPermintaan: PermintaanItem[] = [
  { id: "1", nama: "Muthia Ariesta",  golongan: "A-",  terpenuhi: 1, total: 4, lokasi: "Kota Malang",      tanggal: "1 Maret 2026"  },
  { id: "2", nama: "Illona Nasywa",   golongan: "B+",  terpenuhi: 0, total: 1, lokasi: "D.I.Y Yogyakarta", tanggal: "4 Maret 2026"  },
  { id: "3", nama: "Kim Jiwon",       golongan: "B-",  terpenuhi: 1, total: 2, lokasi: "Kota Bandung",     tanggal: "7 Maret 2026"  },
  { id: "4", nama: "Jang Wonyoung",   golongan: "AB+", terpenuhi: 2, total: 3, lokasi: "DKI Jakarta",      tanggal: "8 Maret 2026"  },
  { id: "5", nama: "Kim Gaeul",       golongan: "AB-", terpenuhi: 1, total: 2, lokasi: "Kota Bandung",     tanggal: "10 Maret 2026" },
  { id: "6", nama: "Naoi Rei",        golongan: "O+",  terpenuhi: 3, total: 4, lokasi: "Kota Magelang",    tanggal: "11 Maret 2026" },
];

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
            <span className="text-sm font-semibold text-[#7D0A0A]">Ada yang Butuh Darahmu Segera</span>
            <span className="text-[12px] bg-[#7D0A0A] text-[#FCFAEE] rounded-full px-2.5 py-1">{item.tanggal}</span>
          </div>
          <span className="text-sm text-[#7D0A0A]">{item.pesan}</span>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={14} color="#7D0A0A" />
            <span className="text-[12px] text-[#7D0A0A]">{item.lokasi}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 ml-4 flex-shrink-0">
        <button
          onClick={() => onKonfirmasi(item.id)}
          className="bg-[#7FB73C]/70 border border-[#2F4E09] hover:bg-[#E0FFBB] active:scale-95 transition-all duration-200 text-[#2F4E09] text-sm font-semibold px-6 py-1 rounded-xl">
          Konfirmasi
        </button>
        <button
          onClick={() => onTolak(item.id)}
          className="bg-[#FCFAEE]/0 border border-[#7D0A0A] hover:bg-[#F88E8E] active:scale-95 transition-all duration-200 text-[#7D0A0A] text-sm font-semibold px-6 py-1 rounded-xl">
          Tolak
        </button>
      </div>
    </div>
  );
}

function PermintaanCard({ item }: { item: PermintaanItem }) {
  return (
    <>
      <div className="w-[93%] h-px bg-[#000000]/20 my-3 mx-auto" />
      <div className="flex items-center gap-4 mb-4 justify-center">
        <GolonganBadge golongan={item.golongan} />
        <div className="bg-[#FCFAEE] rounded-full px-5 py-3 flex items-center shadow-lg w-[800px] gap-3">
          <span className="text-sm font-semibold text-[#7D0A0A] w-[150px] shrink-0">{item.nama}</span>
          <div className="w-px h-8 bg-[#000000]/20 shrink-0" />

          <div className="flex items-center gap-4 px-4 w-[200px] shrink-0">
            <ProgressBar terpenuhi={item.terpenuhi} total={item.total} />
            <span className="text-[14px] text-[#7D0A0A] font-semibold whitespace-nowrap">
              {item.terpenuhi}/{item.total} Kantong
            </span>
          </div>

          <div className="w-px h-8 bg-[#000000]/20 shrink-0" />

          <div className="flex items-center gap-1 px-4 w-[180px] shrink-0"> {/* fix: tambah fixed width */}
            <MapPin size={20} color="#7D0A0A" className="shrink-0" />
            <span className="text-[14px] text-[#7D0A0A] font-semibold whitespace-nowrap">{item.lokasi}</span>
          </div>

          <div className="w-px h-8 bg-[#000000]/20 shrink-0" /> {/* fix: hapus mx-2 */}

          <span className="text-[14px] text-[#7D0A0A] font-semibold w-[130px] shrink-0 px-4 text-right whitespace-nowrap">{item.tanggal}</span> {/* fix: tambah whitespace-nowrap */}

        </div>
      </div>
    </>
  );
}

export default function PermintaanAktif() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterGol, setFilterGol] = useState<GolonganFilter>("Semua Gol.");

  const handleKonfirmasi = (id: string) => {
    alert(`Konfirmasi notifikasi id: ${id}`);
  };

  const handleTolak = (id: string) => {
    alert(`Tolak notifikasi id: ${id}`);
  };

  const filtered = dummyPermintaan.filter((p) => {
    const matchGol = filterGol === "Semua Gol." || p.golongan === filterGol;
    const matchSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.lokasi.toLowerCase().includes(search.toLowerCase());
    return matchGol && matchSearch;
  });

  return (
    <div className="min-h-screen w-full font-[Plus_Jakarta_Sans] bg-[linear-gradient(225deg,#e8b0b0_0%,#f0d8d8_30%,#FCFAEE_70%)] px-8 py-7">
      <div className="relative flex items-center justify-center mb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-0 p-1 hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer">
          <ArrowLeft size={32} color="#7D0A0A" />
        </button>
        <h1 className="text-2xl font-extrabold tracking-[1.5px] text-[#7D0A0A]">
          PERMINTAAN AKTIF
        </h1>
      </div>

      <div className="flex items-center gap-4 mb-4 justify-center">
        <GolonganBadge golongan={permintaanSaya.golongan} />
        <div className="bg-[#FCFAEE] rounded-full px-5 py-3 flex items-center gap-8 shadow-lg w-[800px]">
          <span className="text-sm font-semibold text-[#7D0A0A]">Permintaan Saya</span>
          <div className="w-px h-8 bg-[#000000]/20" />
          <div className="flex items-center gap-4">
            <ProgressBar terpenuhi={permintaanSaya.terpenuhi} total={permintaanSaya.total} />
            <span className="text-[14px] text-[#7D0A0A] font-semibold">
              {permintaanSaya.terpenuhi}/{permintaanSaya.total} Kantong
            </span>
          </div>
          <div className="w-px h-8 bg-[#000000]/20" />
          <div className="flex items-center gap-1">
            <MapPin size={24} color="#7D0A0A" />
            <span className="text-[14px] text-[#7D0A0A] font-semibold">{permintaanSaya.lokasi}</span>
          </div>
          <div className="w-px h-8 bg-[#000000]/20" />
          <span className="text-[14px] text-[#7D0A0A] font-semibold">{permintaanSaya.tanggal}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-[#F88E8E]/30 rounded-3xl p-5 w-[1000px]">

          <div className="flex items-center gap-2 bg-[#FCFAEE] rounded-2xl px-4 py-3 mb-4">
            <Search size={24} color="#7D0A0A" />
            <input
              type="text"
              placeholder="Cari lokasi ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#7D0A0A] placeholder-[#7D0A0A]/40"/>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {golonganList.map((gol) => (
              <button
                key={gol}
                onClick={() => setFilterGol(gol)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 border
                  ${filterGol === gol
                    ? "bg-[#7D0A0A] text-[#FCFAEE] border-transparent shadow-lg"
                    : "bg-[#FCFAEE] text-[#7D0A0A] border-[rgba(125,10,10,0.2)] hover:bg-[#f0ccc8] shadow-lg"
                  }`}>
                {gol}
              </button>
            ))}
          </div>

          {dummyNotifikasi.map((notif) => (
            <NotifikasiCard
              key={notif.id}
              item={notif}
              onKonfirmasi={handleKonfirmasi}
              onTolak={handleTolak}/>
          ))}

          <div className="flex flex-col">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <PermintaanCard key={item.id} item={item} />
              ))
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
