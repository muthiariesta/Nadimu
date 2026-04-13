"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Users, MessageSquare } from "lucide-react";

interface Komunitas {
  id: string;
  nama: string;
  deskripsi: string;
  jumlah_pesan: number;
  jumlah_anggota: number;
  sudahGabung?: boolean;
}

const MOCK_KOMUNITAS: Komunitas[] = [
  { id: "1", nama: "Rhesus Negatif Indonesia", deskripsi: "Komunitas pemilik rhesus negatif di seluruh Indonesia.", jumlah_pesan: 1200, jumlah_anggota: 54, sudahGabung: false },
  { id: "2", nama: "Pendonor Aktif Jakarta", deskripsi: "Koordinasi pendonor aktif di DKI Jakarta.", jumlah_pesan: 37, jumlah_anggota: 12, sudahGabung: false },
  { id: "3", nama: "Goldar AB Jawa Tengah", deskripsi: "Komunitas pendonor golongan AB di Jawa Tengah.", jumlah_pesan: 159, jumlah_anggota: 20, sudahGabung: false },
  { id: "4", nama: "Goldar B+ Makassar", deskripsi: "Pendonor golongan B+ di Makassar dan sekitarnya.", jumlah_pesan: 15, jumlah_anggota: 8, sudahGabung: false },
  { id: "5", nama: "Rhesus Positif Jawa Barat", deskripsi: "Jaringan pendonor Rh+ aktif di Jawa Barat.", jumlah_pesan: 1200, jumlah_anggota: 54, sudahGabung: false },
  { id: "6", nama: "Pendonor Gen Z Jember", deskripsi: "Komunitas muda donor darah di Jember.", jumlah_pesan: 37, jumlah_anggota: 12, sudahGabung: false },
  { id: "7", nama: "Surabaya Blood Heroes", deskripsi: "Komunitas donor darah Surabaya dan sekitarnya.", jumlah_pesan: 59, jumlah_anggota: 20, sudahGabung: false },
  { id: "8", nama: "Pendonor Gen Z Tambun", deskripsi: "Generasi muda Tambun yang aktif mendonor.", jumlah_pesan: 67, jumlah_anggota: 6, sudahGabung: false },
];

export default function KomunitasPage() {
  const router = useRouter();
  const [komunitas, setKomunitas] = useState<Komunitas[]>(MOCK_KOMUNITAS);
  const [search, setSearch] = useState("");

  const handleGabung = (k: Komunitas) => {
    setKomunitas((prev) =>
      prev.map((item) =>
        item.id === k.id ? { ...item, sudahGabung: true } : item
      )
    );
    router.push(`/Komunitas/${k.id}`);
  };

  const filtered = komunitas.filter(
    (k) =>
      k.nama.toLowerCase().includes(search.toLowerCase()) ||
      k.deskripsi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "linear-gradient(135deg, #FDF0EE 0%, #FAE8E8 100%)",
      }}
    >
      <div className="relative flex items-center justify-center px-24 pt-10 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-24 p-2 rounded-full hover:bg-[#7D0A0A]/10 transition-colors"
        >
          <ArrowLeft size={32} className="text-[#7D0A0A]" />
        </button>
        <h1
          className="text-2xl font-extrabold text-[#7D0A0A]"
          style={{ letterSpacing: "0.15em" }}
        >
          KOMUNITAS
        </h1>
      </div>

      <div className="px-24 mb-8">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7D0A0A]/50 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari komunitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-full text-sm text-[#7D0A0A] outline-none border border-[#7D0A0A]/25 placeholder:text-[#7D0A0A]/40 focus:border-[#7D0A0A]/50 transition-all shadow-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
          />
        </div>
      </div>

      <div className="px-24 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((k) => (
            <KomunitasCard
              key={k.id}
              k={k}
              onGabung={() => handleGabung(k)}
              onOpen={() => router.push(`/Komunitas/${k.id}`)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#7D0A0A]/50 text-sm font-semibold">
              Tidak ada komunitas ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function KomunitasCard({
  k,
  onGabung,
  onOpen,
}: {
  k: Komunitas;
  onGabung: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      className="flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-200 hover:shadow-md"
      style={{ backgroundColor: "rgba(248, 142, 142, 0.45)" }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7D0A0A] flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#7D0A0A] text-sm truncate">{k.nama}</p>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1 text-[#7D0A0A]/70">
            <Users size={12} />
            <span className="text-[11px] font-semibold">
              {k.jumlah_anggota.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#7D0A0A]/70">
            <MessageSquare size={12} />
            <span className="text-[11px] font-semibold">
              {k.jumlah_pesan.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {k.sudahGabung ? (
        <button
          onClick={onOpen}
          className="flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold bg-[#7D0A0A] text-white transition-all hover:bg-[#5c0808] active:scale-95"
        >
          BUKA
        </button>
      ) : (
        <button
          onClick={onGabung}
          className="flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold bg-white text-[#7D0A0A] border border-[#7D0A0A]/20 transition-all hover:bg-[#7D0A0A] hover:text-white active:scale-95"
        >
          GABUNG
        </button>
      )}
    </div>
  );
}