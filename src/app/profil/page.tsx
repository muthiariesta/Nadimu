"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, MapPin, Trophy, Flame, Heart, Star, ChevronRight } from "lucide-react";
import { UserCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  deskripsi: string;
  lokasi: string;
  poin: number;
  stok: number;
}

// ─── Sub-components (layout sama persis) ─────────────────────────────────────

function PencapaianCard({ item }: { item: PencapaianItem }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl px-4 py-3 border-2 shadow-lg ${
      item.tercapai ? "bg-[#F7D4CC] border-[#7D0A0A]" : "bg-[#F3E9E7] border-[#7D0A0A]"
    }`}>
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
    <div className="relative flex flex-col w-full bg-[#FCE4E4] border border-[#7D0A0A] rounded-[24px] h-full">
      <div className="flex justify-center -mt-5 mb-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-[#7D0A0A]/20 z-10 bg-[#7D0A0A] text-[#FCFAEE]">
          {item.icon}
        </div>
      </div>
      <div className="px-3 pb-5 flex flex-col items-center flex-1">
        <h3 className="font-bold text-lg text-center leading-tight flex items-start justify-center mt-1 text-[#7D0A0A] min-h-[35px] w-full">
          {item.nama}
        </h3>
        <span className="text-xs text-[#7D0A0A] text-center min-h-[55px]">
          {item.deskripsi}
        </span>
        <div className="flex items-center gap-1 w-full justify-center mt-1 py-1">
          <MapPin size={18} color="#7D0A0A" className="shrink-0" />
          <span className="text-xs text-[#7D0A0A]">{item.lokasi}</span>
        </div>
        <p className="text-md font-black mt-2 text-[#47770D]">{item.poin} poin</p>
      </div>
      <button
        onClick={() => onTukar(item.id)}
        disabled={!bisaTukar || habis}
        className="w-full py-3.5 font-bold text-md transition-all duration-200 outline-none
                   bg-[#7D0A0A] text-[#FCFAEE] border-t border-[#7D0A0A] rounded-b-[22px]
                   hover:bg-[#F88E8E] active:bg-[#F88E8E] active:text-[#7D0A0A]
                   disabled:opacity-40">
        {habis ? "HABIS" : "TUKARKAN"}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilPage() {
  const router = useRouter();
  const { profile, loading } = useProfile();
  const [email, setEmail] = useState("-");
  const [riwayatDonorList, setRiwayatDonorList] = useState<RiwayatDonorItem[]>([]);
  const [tukarPoinList, setTukarPoinList] = useState<TukarPoinItem[]>([]);
  const [badgeList, setBadgeList] = useState<string[]>([]);
  const [allBadges, setAllBadges] = useState<{ nama: string; deskripsi: string }[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  useEffect(() => {
    if (!profile) return;
    const fetchData = async () => {
      // Riwayat donor
      const { data: riwayat } = await supabase
        .from("riwayat_donor")
        .select("id, tanggal_donor, poin_didapat, institusi:pmi_id(nama_institusi)")
        .eq("pengguna_id", profile.id)
        .order("tanggal_donor", { ascending: false })
        .limit(3);
      if (riwayat) {
        setRiwayatDonorList(riwayat.map((r: any) => ({
          id: r.id,
          lokasi: r.institusi?.nama_institusi ?? "-",
          tanggal: new Date(r.tanggal_donor).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          poin: r.poin_didapat,
        })));
      }

      // Voucher
      const { data: voucher } = await supabase
        .from("voucher")
        .select("id, nama, deskripsi, poin_dibutuhkan, stok, lokasi")
        .order("poin_dibutuhkan", { ascending: true })
        .limit(3);
      if (voucher) {
        setTukarPoinList(voucher.map((v: any, i: number) => ({
          id: v.id,
          icon: i === 0 ? <Heart size={20} /> : i === 1 ? <Star size={20} /> : <Trophy size={20} />,
          nama: v.nama,
          deskripsi: v.deskripsi ?? "-",
          lokasi: v.lokasi ?? "-",
          poin: v.poin_dibutuhkan,
          stok: v.stok,
        })));
      }

      // Semua badge yang ada
      const { data: badges } = await supabase
        .from("badge")
        .select("nama, deskripsi");
      if (badges) setAllBadges(badges);

      // Badge yang dimiliki user
      const { data: badgePengguna } = await supabase
        .from("badge_pengguna")
        .select("badge_nama")
        .eq("pengguna_id", profile.id);
      if (badgePengguna) setBadgeList(badgePengguna.map((b: any) => b.badge_nama));
    };
    fetchData();
  }, [profile]);

  const handleTukar = async (id: string) => {
    if (!profile) return;
    const voucher = tukarPoinList.find((v) => v.id === id);
    if (!voucher) return;

    // Insert penukaran
    const { error } = await supabase.from("penukaran_poin").insert({
      pengguna_id: profile.id,
      voucher_id: id,
      poin_digunakan: voucher.poin,
    });

    if (error) {
      alert("Gagal menukar poin: " + error.message);
      return;
    }

    // Kurangi poin di profil
    const { error: errorPoin } = await supabase
      .from("profil")
      .update({ total_poin: (profile.total_poin ?? 0) - voucher.poin })
      .eq("id", profile.id);

    if (errorPoin) {
      alert("Penukaran berhasil tapi poin gagal diperbarui: " + errorPoin.message);
      return;
    }

    // Kurangi stok voucher
    const { error: errorStok } = await supabase
      .from("voucher")
      .update({ stok: voucher.stok - 1 })
      .eq("id", id);

    if (errorStok) {
      alert("Penukaran berhasil tapi stok gagal diperbarui");
      return;
    }

    alert("Berhasil menukar poin! Kode Voucher Anda: " + id);

    // Update state lokal supaya UI langsung berubah tanpa reload
    setTukarPoinList((prev) =>
      prev.map((v) => v.id === id ? { ...v, stok: v.stok - 1 } : v)
    );
  };

  const totalDonor = profile?.total_donor ?? 0;
  const golongan = `${profile?.golongan_darah ?? ""}${profile?.rhesus ?? ""}`;

  const iconMap: Record<string, React.ReactNode> = {
    "Donor Perdana": <Trophy size={24} />,
    "5x Donor":   <Flame size={24} />,
    "Penyelamat Darurat":  <Heart size={24} />,
    "10x Donor":   <Star size={24} />,
  };

  const pencapaianList: PencapaianItem[] = allBadges.map((b) => ({
    id: b.nama,
    icon: iconMap[b.nama] ?? <Trophy size={24} />,
    nama: b.nama,
    deskripsi: b.deskripsi ?? "-",
    tercapai: badgeList.includes(b.nama),
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAEE]">
        <div className="w-8 h-8 border-4 border-[#7D0A0A]/20 border-t-[#7D0A0A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] bg-[radial-gradient(ellipse_at_center,#e8c0c0_0%,#f3e4e4_40%,#FCFAEE_100%)] px-6 py-8 flex flex-col gap-6">
      <div className="relative flex items-center justify-center mb-2">
        <button
          onClick={() => router.back()}
          className="absolute left-0 text-[#7D0A0A] cursor-pointer hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={28} />
        </button>
      </div>

      <div className="flex items-start gap-6 px-15">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 bg-[#7D0A0A] rounded-full flex items-center justify-center">
            {profile?.foto_url ? (
              <img src={profile.foto_url} alt="Foto Profil" className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserCircle size={72} color="#FCFAEE" strokeWidth={1.5} />
            )}
          </div>
          <span
            onClick={() => router.push("/Isiprofil")}
            className="text-md font-semibold text-[#7D0A0A] cursor-pointer hover:underline"
          >
            Edit Profil
          </span>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <span className="text-4xl font-extrabold text-[#7D0A0A]">{profile?.nama_lengkap ?? "-"}</span>
          <span className="text-lg text-[#7D0A0A]">{email}</span>
          <span className="text-lg text-[#7D0A0A]">
            {golongan} &nbsp;|&nbsp; {profile?.kota ?? "-"} &nbsp;|&nbsp; Bergabung{" "}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
              : "-"}
          </span>
          <div className="flex items-center justify-between bg-[#EA7B7B]/50 rounded-lg px-4 py-2 mt-1.5 w-[800px]">
            <span className="text-sm text-[#7D0A0A]">Bagikan pencapaianmu dan ajak orang lain untuk jadi penyelamat</span>
            <Share2 size={18} color="#7D0A0A" className="shrink-0 ml-2 cursor-pointer" />
          </div>
        </div>

        <div className="bg-[#7D0A0A] text-[#FCFAEE] rounded-2xl px-8 py-5 flex flex-col items-center justify-center min-w-[160px] h-[160px]">
          <span className="text-4xl font-semibold">Donor</span>
          <span className="text-[70px] font-bold leading-none">{totalDonor}X</span>
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
              <span
                onClick={() => router.push("/Riwayatdonor")}
                className="text-lg font-extrabold text-[#7D0A0A] cursor-pointer hover:opacity-70 transition-opacity"
              >
                Riwayat Donor
              </span>
              <button
                onClick={() => router.push("/Riwayatdonor")}
                className="text-[#7D0A0A] hover:opacity-70 transition-opacity cursor-pointer"
              >
                <ChevronRight size={28} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {riwayatDonorList.length > 0 ? (
                riwayatDonorList.map((item) => (
                <RiwayatDonorCard key={item.id} item={item} />
              ))
            ) : (
              <div className="flex items-center justify-between bg-[#F7D4CC] border-2 border-[#7D0A0A] rounded-2xl px-5 py-4">
                <span className="text-md text-[#7D0A0A]/60">Belum ada riwayat donor</span>
                <span className="text-md font-bold text-[#47770D]">-</span>
              </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  onClick={() => router.push("/Tukarpoin")}
                  className="text-lg font-extrabold text-[#7D0A0A] cursor-pointer hover:opacity-70 transition-opacity"
                >
                  Tukar Poin
                </span>
                <span className="bg-[#7FB73C]/50 text-[#4A7811] text-sm font-bold px-3 py-1 rounded-full">
                  {profile?.total_poin ?? 0} poin
                </span>
              </div>
              <button
                onClick={() => router.push("/Tukarpoin")}
                className="text-[#7D0A0A] hover:opacity-70 transition-opacity cursor-pointer"
              >
                <ChevronRight size={28} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 items-stretch mt-6">
              {tukarPoinList.map((item) => (
                <TukarPoinCard
                  key={item.id}
                  item={item}
                  userPoin={profile?.total_poin ?? 0}
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
