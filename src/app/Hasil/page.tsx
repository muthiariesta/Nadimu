"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
        <span className="text-sm text-[#7D0A0A] opacity-100">{item.keterangan}</span>
      </div>
      <button
        onClick={() => onHubungkan(item.id)}
        className="bg-[#7D0A0A] hover:bg-[#F88E8E] active:scale-95 transition-all duration-200 text-[#FCFAEE] font-semibold text-sm px-6 py-2 rounded-xl">
        Hubungkan
      </button>
    </div>
  );
}

const hasil: HasilItem[] = [
  { id: "1", nama: "PMI Jakarta",    keterangan: "Stok: 12 Kantong" },
  { id: "2", nama: "Aisyah Aries",   keterangan: "Bekasi" },
  { id: "3", nama: "Illona Nasywa",  keterangan: "Bandung" }
];

export default function Hasil() {
  const router = useRouter();

  const handleHubungkan = (id: string) => {
    // backend
    alert(`Menghubungkan ke id: ${id}`);
  };

  return (
    <div className="min-h-screen w-full font-[Plus_Jakarta_Sans] bg-[#FCFAEE] px-10 py-8">
      <div className="relative flex items-center justify-center mb-10">
        <button
          onClick={() => router.back()}
          className="absolute left-0 p-1 hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer">
          <ArrowLeft size={32} color="#7D0A0A" />
        </button>
        <h1 className="text-3xl font-extrabold tracking-[1.5px] text-[#7D0A0A]">
          HASIL
        </h1>
      </div>

      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {hasil.map((item) => (
          <HasilCard
            key={item.id}
            item={item}
            onHubungkan={handleHubungkan}/>
        ))}

        {hasil.length === 0 && (
          <p className="text-center text-[#7D0A0A] opacity-100 mt-10 text-2xl">
            Tidak ada hasil yang ditemukan
          </p>
        )}
      </div>
    </div>
  );
}
