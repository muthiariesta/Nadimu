"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CardVoucher from "@/components/CardTukarPoin";
import { ArrowLeft } from "lucide-react";

interface Voucher {
  id: string;
  nama: string;
  deskripsi: string;
  poin_dibutuhkan: number;
  stok: number;
}

export default function TukarPoinPage() {
  const router = useRouter();
  const [voucherList, setVoucherList] = useState<Voucher[]>([]);
  const [userPoin, setUserPoin] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: vouchers } = await supabase
        .from("voucher")
        .select("id, nama, deskripsi, poin_dibutuhkan, stok")
        .order("poin_dibutuhkan", { ascending: true });

      if (vouchers) setVoucherList(vouchers);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profil } = await supabase
          .from("profil")
          .select("total_poin")
          .eq("id", user.id)
          .single();
        if (profil) setUserPoin(profil.total_poin ?? 0);
      }
    };
    fetchData();
  }, []);

  const handleTukar = async (voucher: Voucher) => {
    if (userPoin < voucher.poin_dibutuhkan) {
      alert("Poin kamu tidak cukup!");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("penukaran_poin").insert({
      pengguna_id: user.id,
      voucher_id: voucher.id,
      poin_digunakan: voucher.poin_dibutuhkan,
    });

    if (!error) {
      await supabase
        .from("profil")
        .update({ total_poin: userPoin - voucher.poin_dibutuhkan })
        .eq("id", user.id);

      setUserPoin((prev) => prev - voucher.poin_dibutuhkan);
      alert(`Berhasil menukar ${voucher.nama}!`);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-[#FDF0EE] to-[#FAE8E8] font-jakarta">
      <div className="relative flex items-center justify-center px-8 mb-10">
        <button 
          onClick={() => router.back()} 
          className="absolute left-8 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={32} className="text-[#7D0A0A] hover:opacity-60" strokeWidth={2.5} />
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#7D0A0A]">
            TUKAR POIN
          </h1>
          <p className="text-sm font-semibold text-[#7D0A0A]/80 mt-1">
            Poin kamu: <span className="font-black text-[#47770D]">{userPoin}</span>
          </p>
        </div>
      </div>

      <div className="px-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12 max-w-7xl mx-auto">
          {voucherList.map((voucher) => (
            <CardVoucher
              key={voucher.id}
              nama={voucher.nama}
              deskripsi={voucher.deskripsi}
              poin_dibutuhkan={voucher.poin_dibutuhkan}
              stok={voucher.stok}
              onTukar={() => handleTukar(voucher)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}