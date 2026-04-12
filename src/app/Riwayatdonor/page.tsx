"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface RiwayatDonorItem {
  id: string;
  lokasi: string;
  tanggal: string;
  poin: number;
}

const riwayatDonorData: RiwayatDonorItem[] = [
  { id: "1", lokasi: "PMI Bekasi",               tanggal: "12 Des 2025", poin: 200 },
  { id: "2", lokasi: "PMI Bekasi",               tanggal: "24 Mei 2025", poin: 200 },
  { id: "3", lokasi: "PMI Bandung",              tanggal: "10 Jan 2025", poin: 200 },
  { id: "4", lokasi: "Hari Donor Darah Sedunia", tanggal: "17 Agu 2024", poin: 400 },
];

function RiwayatDonorCard({ item }: { item: RiwayatDonorItem }) {
  return (
    <div className="flex items-center justify-between bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl px-6 py-4">
      <div className="flex flex-col gap-1">
        <span className="text-md font-bold text-[#7D0A0A]">{item.lokasi}</span>
        <span className="text-sm font-base text-[#7D0A0A]">{item.tanggal}</span>
      </div>
      <span className="text-sm font-bold text-[#4A7811]">+{item.poin} poin</span>
    </div>
  );
}

export default function RiwayatDonorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] bg-[#F5EBE0] flex flex-col px-10 py-8">
      <button
          onClick={() => router.back()}
          className="self-start text-[#7D0A0A] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer mb-4"> 
          <ArrowLeft size={32} color="#7D0A0A" />
        </button>
      <h1 className="text-center text-2xl font-extrabold text-[#7D0A0A] tracking-[1px] mb-8">
        RIWAYAT DONOR
      </h1>

      <div className="flex flex-col gap-3 w-full max-w-xl mx-auto">
        {riwayatDonorData.map((item) => (
          <RiwayatDonorCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}