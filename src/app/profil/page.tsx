"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, MapPin, Trophy, Flame, Heart, Star, ChevronRight } from "lucide-react";
import { UserCircle } from "lucide-react";

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
  stok: number;
}

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
  { id: "t1", icon: <Heart size={20} />, nama: "Medical Check-Up Gratis", lokasi: "RS Hermina", poin: 1000, stok: 1000 },
  { id: "t2", icon: <Star size={20} />, nama: "Enamel Pin PMI", lokasi: "PMI Terdekat", poin: 1000, stok: 1000 },
  { id: "t3", icon: <Trophy size={20} />, nama: "Hampers Sembako", lokasi: "PMI Terdekat", poin: 1000, stok: 1000 },
];

function PencapaianCard({ item }: { item: PencapaianItem }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl px-4 py-3 border-2 shadow-lg ${
      item.tercapai
        ? "bg-[#F7D4CC] border-[#7D0A0A]"
        : "bg-[#F3E9E7] border-[#7D0A0A]"}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
        item.tercapai ? "bg-[#7D0A0A] text-[#FCFAEE]" : "bg-[#BF3131]/30 text-[#FCFAEE]/60"
      }`}>
        {item.icon}
      </div>
      <div className="flex flex-col">
        <span className={`text-md font-bold ${item.tercapai ? "text-[#7D0A0A]" : "text-[#7D0A0A]/60"}`}>
          {item.nama}
        </span>
        <span className={`text-sm ${item.tercapai ? "text-[#7D0A0A]" : "text-[#7D0A0A]/60"}`}>
          {item.deskripsi}
        </span>
      </div>
    </div>
  );
}

function RiwayatDonorCard({ item }: { item: RiwayatDonorItem }) {
  return (
    <div className="flex items-center justify-between bg-[#F7D4CC] border-2 border-[#7D0A0A] rounded-2xl px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="text-md font-bold text-[#7D0A0A]">{item.lokasi}</span>
        <span className="text-sm text-[#7D0A0A]">{item.tanggal}</span>
      </div>
      <span className="text-md font-bold text-[#47770D]">+{item.poin} poin</span>
    </div>
  );
}

function TukarPoinCard({ item, userPoin, onTukar }: { item: TukarPoinItem; userPoin: number; onTukar: (id: string) => void }) {
  const bisaTukar = userPoin >= item.poin;
  const habis = item.stok === 0;
  return (
    <div className="realtive flex flex-col  w-full bg-[#FCE4E4] border border-[#7D0A0A] rounded-[24px]">
      <div className="flex justify-center -mt-5 mb-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-[#7D0A0A]/20 z-10 bg-[#7D0A0A] text-[#FCFAEE]">
          {item.icon}
        </div>
      </div>

      <div className="px-3 pb-5 flex flex-col items-center gap-1 flex-1">
        <h3 className="font-bold text-lg text-center leading-tight min-h-[40px] flex items-center justify-center mt-1 text-[#7D0A0A]">
          {item.nama}"
        </h3>
        <div className="flex items-center gap-1">
          <MapPin size={24} color="#7D0A0A" />
          <span className="text-md text-[#7D0A0A]">{item.lokasi}</span>
        </div>
        <p className="text-md font-black mt-2 text-[#47770D]">{item.poin} poin</p>
      </div>
      <button
        onClick={() => onTukar(item.id)}
        disabled={!bisaTukar}
        className="w-full py-3.5 font-bold text-md transition-all duration-200 outline-none
                   bg-[#7D0A0A] text-[#FCFAEE] border-t border-[#7D0A0A] rounded-b-[22px]
                   hover:bg-[#F88E8E] active:bg-[#F88E8E] active:text-[#7D0A0A]
                   disabled:opacity-40">
        {habis ? "HABIS" : "TUKARKAN"}
      </button>
    </div>
  );
}

export default function ProfilPage() {
  const router = useRouter();

  const handleTukar = (id: string) => {
    alert(`Tukar poin item id: ${id}`);
  };

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] bg-[radial-gradient(ellipse_at_center,#e8c0c0_0%,#f3e4e4_40%,#FCFAEE_100%)] px-6 py-8 flex flex-col gap-6">
      <div className="relative flex items-center justify-center mb-2">
        <button
        onClick={() => router.back()}
        className="absolute left-0 text-[#7D0A0A] cursor-pointer hover:opacity-70 transition-opacity">
          <ArrowLeft size={28} />
        </button>
      </div>
      <div className="flex items-start gap-6 px-15">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 bg-[#7D0A0A] rounded-full flex items-center justify-center">
            <UserCircle size={72} color="#FCFAEE" strokeWidth={1.5}/>
          </div>
          <span className="text-md font-semibold text-[#7D0A0A] cursor-pointer hover:underline">Edit Profil</span>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <span className="text-4xl font-extrabold text-[#7D0A0A]">{userProfile.nama}</span>
          <span className="text-lg text-[#7D0A0A]">{userProfile.email}</span>
          <span className="text-lg text-[#7D0A0A]">
            {userProfile.golongan} &nbsp;|&nbsp; {userProfile.lokasi} &nbsp;|&nbsp; Bergabung {userProfile.bergabung}
          </span>
          <div className="flex items-center justify-between bg-[#EA7B7B]/50 rounded-lg px-4 py-2 mt-1.5 w-[800px]">
            <span className="text-sm text-[#7D0A0A]">Bagikan pencapaianmu dan ajak orang lain untuk jadi penyelamat</span>
            <Share2 size={18} color="#7D0A0A" className="shrink-0 ml-2 cursor-pointer" />
          </div>
        </div>

        <div className="bg-[#7D0A0A] text-[#FCFAEE] rounded-2xl px-8 py-5 flex flex-col items-center justify-center min-w-[160px] h-[160px]">
          <span className="text-4xl font-semibold">Donor</span>
          <span className="text-[70px] font-bold leading-none">{userProfile.jumlahDonor}X</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 px-15">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-extrabold text-[#7D0A0A]">Pencapaian</span>
          <div className="flex flex-col gap-4">
            {pencapaianList.map((item) => (
              <PencapaianCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-[#7D0A0A]">Riwayat Donor</span>
              <button className="text-[#7D0A0A] hover:opacity-70 transition-opacity cursor-pointer">
                <ChevronRight size={28} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {riwayatDonorList.map((item) => (
                <RiwayatDonorCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-[#7D0A0A]">Tukar Poin</span>
                <span className="bg-[#7FB73C]/50 text-[#4A7811] text-sm font-bold px-3 py-1 rounded-full">
                  {userProfile.poin} poin
                </span>
              </div>
              <button className="text-[#7D0A0A] hover:opacity-70 transition-opacity cursor-pointer">
                <ChevronRight size={28} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {tukarPoinList.map((item) => (
                <TukarPoinCard
                  key={item.id}
                  item={item}
                  userPoin={userProfile.poin}
                  onTukar={handleTukar}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}