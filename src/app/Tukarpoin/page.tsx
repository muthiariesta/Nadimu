"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Heart, Star, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TukarPoinItem {
  id: string;
  icon: React.ReactNode;
  nama: string;
  deskripsi: string;
  lokasi: string;
  poin: number;
  stok: number;
}

function TukarPoinCard({ item, userPoin, onTukar }: {
  item: TukarPoinItem;
  userPoin: number;
  onTukar: (id: string) => void;
}) {
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

export default function TukarPoinPage() {
  const router = useRouter();
  const [voucherList, setVoucherList] = useState<TukarPoinItem[]>([]);
  const [userPoin, setUserPoin] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data: profil } = await supabase
        .from("profil")
        .select("total_poin")
        .eq("id", user.id)
        .single();
      if (profil) setUserPoin(profil.total_poin ?? 0);

      const { data: vouchers } = await supabase
        .from("voucher")
        .select("id, nama, deskripsi, lokasi, poin_dibutuhkan, stok")
        .order("poin_dibutuhkan", { ascending: true });

      if (vouchers) {
        setVoucherList(vouchers.map((v: any, i: number) => ({
          id: v.id,
          icon: i % 3 === 0 ? <Heart size={20} /> : i % 3 === 1 ? <Star size={20} /> : <Trophy size={20} />,
          nama: v.nama,
          deskripsi: v.deskripsi ?? "-",
          lokasi: v.lokasi ?? "-",
          poin: v.poin_dibutuhkan,
          stok: v.stok,
        })));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleTukar = async (id: string) => {
    if (!userId) return;
    const voucher = voucherList.find((v) => v.id === id);
    if (!voucher) return;

    const { error } = await supabase.from("penukaran_poin").insert({
      pengguna_id: userId,
      voucher_id: id,
      poin_digunakan: voucher.poin,
    });

    if (error) { alert("Gagal menukar poin: " + error.message); return; }

    await supabase
      .from("profil")
      .update({ total_poin: userPoin - voucher.poin })
      .eq("id", userId);

    await supabase
      .from("voucher")
      .update({ stok: voucher.stok - 1 })
      .eq("id", id);

    setUserPoin((prev) => prev - voucher.poin);
    setVoucherList((prev) =>
      prev.map((v) => v.id === id ? { ...v, stok: v.stok - 1 } : v)
    );
    alert("Berhasil menukar poin!");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF0EE] to-[#FAE8E8]">
      <div className="w-8 h-8 border-4 border-[#7D0A0A]/20 border-t-[#7D0A0A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-[#FDF0EE] to-[#FAE8E8] font-[Plus_Jakarta_Sans]">
      <div className="relative flex items-center justify-center px-8 mb-10">
        <button
          onClick={() => router.back()}
          className="absolute left-8 p-2 rounded-full transition-colors">
          <ArrowLeft size={32} className="text-[#7D0A0A] hover:opacity-60" strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#7D0A0A]">TUKAR POIN</h1>
          <p className="text-sm font-semibold text-[#7D0A0A]/80 mt-1">
            Poin kamu: <span className="font-black text-[#47770D]">{userPoin}</span>
          </p>
        </div>
      </div>

      <div className="px-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12 max-w-7xl mx-auto items-stretch">
          {voucherList.map((item) => (
            <TukarPoinCard
              key={item.id}
              item={item}
              userPoin={userPoin}
              onTukar={handleTukar}
            />
          ))}
        </div>
      </div>
    </div>
  );
}