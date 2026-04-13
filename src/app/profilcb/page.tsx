"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, MapPin, Trophy, Flame, Heart, Star } from "lucide-react";
import { UserCircle } from "lucide-react";

// ============ TYPES ============
interface UserProfile {
  nama: string;
  email: string;
  golongan: string;
  lokasi: string;
  bergabung: string;
  jumlahDonor: number;
  poin: number;
}

interface PencapaianItem {
  id: string;
  icon: React.ReactNode;
  nama: string;
  deskripsi: string;
  tercapai: boolean;
}

interface RiwayatDonorItem {
  id: string;
  lokasi: string;
  tanggal: string;
  poin: number;
}

interface TukarPoinItem {
  id: string;
  icon: React.ReactNode;
  nama: string;
  lokasi: string;
  poin: number;
}

// ============ DATA ============
const userProfile: UserProfile = {
  nama: "Benedicta Sherin",
  email: "benedictpresley@gmail.com",
  golongan: "O+",
  lokasi: "Tambun Selatan",
  bergabung: "Februari 2024",
  jumlahDonor: 4,
  poin: 1000,
};

const pencapaianList: PencapaianItem[] = [
  { id: "p1", icon: <Trophy size={24} />,  nama: "First Blood",  deskripsi: "Donor pertama kali",              tercapai: true  },
  { id: "p2", icon: <Flame size={24} />,   nama: "On Streak",    deskripsi: "Tiga kali donor berturut-turut",  tercapai: true  },
  { id: "p3", icon: <Heart size={24} />,   nama: "Live Saver",   deskripsi: "Lima kali donor",                 tercapai: false },
  { id: "p4", icon: <Star size={24} />,    nama: "Rare Hero",    deskripsi: "Menyumbang golongan darah langka", tercapai: false },
];

const riwayatDonorList: RiwayatDonorItem[] = [
  { id: "r1", lokasi: "PMI Bekasi", tanggal: "12 Des 2025", poin: 200 },
];

const tukarPoinList: TukarPoinItem[] = [
  { id: "t1", icon: <Heart size={20} />,  nama: "Medical Check-Up Gratis", lokasi: "RS Hermina",   poin: 1000 },
  { id: "t2", icon: <Star size={20} />,   nama: "Enamel Pin PMI",          lokasi: "PMI Terdekat", poin: 1000 },
  { id: "t3", icon: <Trophy size={20} />, nama: "Hampers Sembako",         lokasi: "PMI Terdekat", poin: 1000 },
];

// ============ COMPONENTS ============
function PencapaianCard({ item }: { item: PencapaianItem }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl px-4 py-3 border-2 ${
      item.tercapai
        ? "bg-[#FCFAEE] border-[#7D0A0A]/60"
        : "bg-[#FCFAEE]/40 border-[#7D0A0A]/10"
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
        item.tercapai ? "bg-[#7D0A0A] text-[#FCFAEE]" : "bg-[#7D0A0A]/20 text-[#7D0A0A]/40"
      }`}>
        {item.icon}
      </div>
      <div className="flex flex-col">
        <span className={`text-sm font-bold ${item.tercapai ? "text-[#7D0A0A]" : "text-[#7D0A0A]/40"}`}>
          {item.nama}
        </span>
        <span className={`text-xs ${item.tercapai ? "text-[#7D0A0A]/70" : "text-[#7D0A0A]/30"}`}>
          {item.deskripsi}
        </span>
      </div>
    </div>
  );
}

function RiwayatDonorCard({ item }: { item: RiwayatDonorItem }) {
  return (
    <div className="flex items-center justify-between bg-[#FCFAEE] border border-[#7D0A0A]/20 rounded-2xl px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-[#7D0A0A]">{item.lokasi}</span>
        <span className="text-xs text-[#7D0A0A]/70">{item.tanggal}</span>
      </div>
      <span className="text-sm font-bold text-[#4A7811]">+{item.poin} poin</span>
    </div>
  );
}

function TukarPoinCard({ item, userPoin, onTukar }: { item: TukarPoinItem; userPoin: number; onTukar: (id: string) => void }) {
  const bisaTukar = userPoin >= item.poin;
  return (
    <div className="bg-[#F7D4CC] rounded-2xl overflow-hidden flex flex-col">
      <div className="flex flex-col items-center gap-2 px-4 pt-4 pb-3 flex-1">
        <div className="w-10 h-10 bg-[#FCFAEE] rounded-full flex items-center justify-center text-[#7D0A0A]">
          {item.icon}
        </div>
        <span className="text-sm font-bold text-[#7D0A0A] text-center">{item.nama}</span>
        <div className="flex items-center gap-1">
          <MapPin size={12} color="#7D0A0A" />
          <span className="text-xs text-[#7D0A0A]/70">{item.lokasi}</span>
        </div>
        <span className="text-xs text-[#7D0A0A]/70">{item.poin} poin</span>
      </div>
      <button
        onClick={() => onTukar(item.id)}
        disabled={!bisaTukar}
        className={`w-full py-2.5 text-sm font-extrabold tracking-wider transition-colors ${
          bisaTukar
            ? "bg-[#7D0A0A] text-[#FCFAEE] hover:bg-[#BF3131]"
            : "bg-[#7D0A0A]/30 text-[#FCFAEE]/50 cursor-not-allowed"
        }`}>
        TUKARKAN
      </button>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function ProfilPage() {
  const router = useRouter();

  const handleTukar = (id: string) => {
    alert(`Tukar poin item id: ${id}`);
  };

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] bg-[#FCFAEE] px-10 py-8 flex flex-col gap-6">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="self-start text-[#7D0A0A] cursor-pointer">
        <ArrowLeft size={28} />
      </button>

      {/* Header Profil */}
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="w-24 h-24 bg-[#7D0A0A] rounded-full flex items-center justify-center">
            <UserCircle size={64} color="#FCFAEE" />
          </div>
          <span className="text-xs font-semibold text-[#7D0A0A] cursor-pointer hover:underline">Edit Profil</span>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <span className="text-2xl font-extrabold text-[#7D0A0A]">{userProfile.nama}</span>
          <span className="text-sm text-[#7D0A0A]/70">{userProfile.email}</span>
          <span className="text-sm text-[#7D0A0A]/70">
            {userProfile.golongan} &nbsp;|&nbsp; {userProfile.lokasi} &nbsp;|&nbsp; Bergabung {userProfile.bergabung}
          </span>
          <div className="flex items-center justify-between bg-[#F7D4CC] rounded-xl px-4 py-2 mt-1">
            <span className="text-sm text-[#7D0A0A]">Bagikan pencapaianmu dan ajak orang lain untuk jadi penyelamat</span>
            <Share2 size={18} color="#7D0A0A" className="shrink-0 ml-2" />
          </div>
        </div>

        {/* Jumlah Donor */}
        <div className="bg-[#7D0A0A] text-[#FCFAEE] rounded-2xl px-8 py-5 flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-sm font-semibold">Donor</span>
          <span className="text-5xl font-extrabold leading-none">{userProfile.jumlahDonor}X</span>
        </div>
      </div>

      {/* Grid Bawah */}
      <div className="grid grid-cols-2 gap-6">

        {/* Pencapaian */}
        <div className="flex flex-col gap-3">
          <span className="text-lg font-extrabold text-[#7D0A0A]">Pencapaian</span>
          <div className="flex flex-col gap-2">
            {pencapaianList.map((item) => (
              <PencapaianCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Riwayat Donor + Tukar Poin */}
        <div className="flex flex-col gap-4">

          {/* Riwayat Donor */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-[#7D0A0A]">Riwayat Donor</span>
              <button className="text-[#7D0A0A] hover:opacity-70">›</button>
            </div>
            <div className="flex flex-col gap-2">
              {riwayatDonorList.map((item) => (
                <RiwayatDonorCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Tukar Poin */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-[#7D0A0A]">Tukar Poin</span>
                <span className="bg-[#7FB73C]/60 text-[#2F4E09] text-xs font-bold px-3 py-1 rounded-full">
                  {userProfile.poin} poin
                </span>
              </div>
              <button className="text-[#7D0A0A] hover:opacity-70">›</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {tukarPoinList.map((item) => (
                <TukarPoinCard
                  key={item.id}
                  item={item}
                  userPoin={userProfile.poin}
                  onTukar={handleTukar}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}