"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Cross, Map, UserCircle, Newspaper, Calendar, ClipboardList, LogOut, MapPin, User } from "lucide-react";

interface KegiatanItem {
  id: string;
  nama: string;
  penyelenggara: string;
  tanggal: string;
  bulanTahun: string;
  lokasi: string;
}

interface RiwayatDonorItem {
  id: string;
  nama: string;
  penyelenggara: string;
  tanggal: string;
  bulanTahun: string;
  lokasi1: string;
  lokasi2: string;
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

interface UserProfile {
  nama: string;
  poin: number;
  kota: string;
}

const userProfile: UserProfile = {
  nama: "Benedicta Sherin",
  poin: 1000,
  kota: "Bandung",
};

const kegiatanList: KegiatanItem[] = [
  { id: "k1", nama: "Aksi Donor Darah", penyelenggara: "HMIF ITB", tanggal: "25", bulanTahun: "April 2026", lokasi: "Aula Barat ITB" },
  { id: "k2", nama: "Donor Darah PMI",  penyelenggara: "PMI Kota", tanggal: "30", bulanTahun: "April 2026", lokasi: "Gedung PMI" },
];

const riwayatDonor: RiwayatDonorItem = {
  id: "r1",
  nama: "Bakti Sosial",
  penyelenggara: "UDD Bekasi",
  tanggal: "12",
  bulanTahun: "Des 2025",
  lokasi1: "UDD Bekasi",
  lokasi2: "PMI Bekasi",
};

const stokDarah: StokDarahItem[] = [
  { golongan: "A",  kantong: 50,  maxKantong: 100 },
  { golongan: "B",  kantong: 75,  maxKantong: 100 },
  { golongan: "O",  kantong: 5,   maxKantong: 100 },
  { golongan: "AB", kantong: 100, maxKantong: 100 },
];

const permintaanAktif: PermintaanAktifItem[] = [
  { id: "p1", golongan: "O+", nama: "Kim Jong Un",    lokasi: "RS Unpad",    tanggal: "14 Maret 2026" },
  { id: "p2", golongan: "O+", nama: "Illona Nasywa",  lokasi: "RS Borromeus",tanggal: "4 Maret 2026"  },
  { id: "p3", golongan: "O+", nama: "Muthia Ariesta",  lokasi: "RS Siloam",   tanggal: "1 Maret 2026"  },
];

const navItems = [
  { label: "Beranda",     icon: Home,          href: "/Dashboard" },
  { label: "Layanan",     icon: Cross,         href: "/Permintaan" },
  { label: "Persebaran",  icon: Map,           href: "/Petastok" },
  { label: "Komunitas",   icon: UserCircle,    href: "/komunitas" },
  { label: "Berita",      icon: Newspaper,     href: "/Berita" },
  { label: "Kegiatan",    icon: Calendar,      href: "/Kegiatan" },
  { label: "Permintaan Aktif",  icon: ClipboardList, href: "/Permintaanaktif" },
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
        <div
          className={`h-full ${barColor} rounded-none transition-all duration-300`}
          style={{ width: `${pct}%` }}/>
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

  const [kegiatanIndex, setKegiatanIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
        setKegiatanIndex((i) => (i === kegiatanList.length - 1 ? 0 : i + 1));}, 5000);
        return () => clearInterval(interval);
         }, []);
         
  const kegiatan = kegiatanList[kegiatanIndex];

  const handleKonfirmasi = (id: string) => {
    alert(`Konfirmasi permintaan id: ${id}`);
  };

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] flex bg-[#FCFAEE]">
      <aside className="w-65 bg-[#F88E8E]/35 flex flex-col py-8 px-5 gap-6 shadow-md shrink-0 pl-3">
        <div className="flex items-center gap-2 mb-4 pl-8">
          <img src="/asset/logo.png" alt="Donor Darah" className="w-8 h-full object-cover object-center block brightness-95"/>
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

        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-md font-semibold text-[#7D0A0A] hover:bg-[#F88E8E]/60 transition-colors pl-6">
          <LogOut size={32} />
          Keluar
        </button>
      </aside>

      <main className="flex-1 px-8 py-7 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-[#7D0A0A] tracking-wide">
            SELAMAT DATANG DI NADIMU!
          </h1>
          <div className="flex items-center gap-3 bg-[#FCFAEE] rounded-2xl px-4 py-2">
            <UserCircle size={48} color="#7D0A0A" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#7D0A0A]">{userProfile.nama}</span>
              <span className="text-md text-[#7D0A0A]/70">{userProfile.poin} Poin</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_5fr] gap-3 flex-1">
            <div className="bg-[#FCFAEE] border border-[#7D0A0A] rounded-2xl p-5 flex flex-col gap-2">
                <h2 className="text-2xl font-extrabold text-[#7D0A0A] tracking-wider text-center">KEGIATAN TERDEKAT</h2>
                <div className="flex flex-col gap-4 flex-1">
                    {kegiatanList.map((k, i) => (
                        <div
                        key={k.id}
                        className={`bg-[#F7D4CC] rounded-xl px-4 py-2 flex flex-col gap-2 flex-1 transition-all duration-500 ${
                            i === kegiatanIndex ? "ring-2 ring-[#7D0A0A]" : "opacity-50"}`}>
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
                        <div className="flex justify-center gap-1.5 mt-1">
                            {kegiatanList.map((_, i) => (
                            <button
                            key={i}
                            onClick={() => setKegiatanIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                            i === kegiatanIndex ? "bg-[#7D0A0A] w-4" : "bg-[#7D0A0A]/30 w-2"}`}/>
                            ))}
                        </div>
        </div>

          <div className="bg-[#F88E8E]/35 rounded-2xl p-5 flex flex-col gap-4">
            <h2 className="text-2xl font-extrabold text-[#7D0A0A] tracking-wider text-center">STOK DARAH</h2>
            <div className="flex items-center gap-3 mb-1">
              <MapPin size={32} color="#7D0A0A" />
              <span className="text-2xl font-bold text-[#7D0A0A]">{userProfile.kota.toUpperCase()}</span>
            </div>
            <div className="flex flex-col gap-6">
              {stokDarah.map((item) => (
                <StokDarahBar key={item.golongan} item={item} />
              ))}
            </div>
          </div>

          <div className="bg-[#FCFAEE] border border-[#7D0A0A] rounded-2xl p-5 flex flex-col gap-1.5">
            <h2 className="text-xl font-extrabold text-[#7D0A0A] tracking-wider text-center">RIWAYAT DONOR DARAH</h2>
            <div className="bg-[#F88E8E]/35 flex flex-col items-center gap-1.5 rounded-2xl px-4 py-2">
              <span className="text-lg font-bold text-[#7D0A0A]">{riwayatDonor.nama}</span>
              <div className="flex items-center gap-4 w-full">
                <div className="bg-[#7D0A0A] text-[#FCFAEE] rounded-2xl px-4 py-3 text-center w-[90px]">
                  <div className="text-2xl font-extrabold leading-none">{riwayatDonor.tanggal}</div>
                  <div className="text-xs mt-1">{riwayatDonor.bulanTahun}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-[#7D0A0A]">{riwayatDonor.lokasi1}</span>
                  <span className="text-lg text-[#7D0A0A]/70">{riwayatDonor.lokasi2}</span>
                </div>
              </div>
              <button className="bg-[#7D0A0A] text-[#FCFAEE] text-md font-semibold px-8 py-1.5 rounded-xl hover:bg-[#F88E8E] transition-colors mt-1 w-full">
                Lihat Sertifikat
              </button>
            </div>
          </div>

          <div className="bg-[#F88E8E]/35 rounded-2xl p-2 flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold text-[#7D0A0A] tracking-wider text-center">PERMINTAAN AKTIF</h2>
            <div className="flex flex-col gap-2.5 bg-[F88E8E]50">
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