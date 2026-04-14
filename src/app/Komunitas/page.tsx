"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, User, Users, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Komunitas {
  id: string;
  nama: string;
  deskripsi: string;
  jumlah_pesan: number;
  jumlah_anggota: number;
  sudahGabung?: boolean;
}

export default function KomunitasPage() {
  const router = useRouter();
  const [komunitas, setKomunitas] = useState<Komunitas[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      await fetchKomunitas(user?.id ?? null);
    };
    init();
  }, []);

  const fetchKomunitas = async (uid: string | null) => {
    setLoading(true);

    const { data: komunitasData, error } = await supabase
    .from("komunitas")
    .select("*")
    .order("nama");
    
    console.log("DATA:", komunitasData);
    console.log("ERROR:", error);

    if (error) {
    console.error("Error", error);
    setLoading(false);
    return;
    }

    let joinedIds = new Set<string>();
    if (uid) {
      const { data: anggotaData } = await supabase
        .from("anggota_komunitas")
        .select("komunitas_id")
        .eq("pengguna_id", uid);

      joinedIds = new Set(anggotaData?.map((a) => a.komunitas_id) ?? []);
    }
    const withStatus = (komunitasData ?? []).map((k) => ({
      ...k,
      sudahGabung: joinedIds.has(k.id),
    }));

    setKomunitas(withStatus);
    setLoading(false);
  };


  const handleGabung = async (k: Komunitas) => {
    if (!userId) {
      router.push("/Login");
      return;
    }

    const { error } = await supabase
      .from("anggota_komunitas")
      .insert({ komunitas_id: k.id, pengguna_id: userId });

    if (error) {
      console.error("Gagal gabung komunitas:", error);
      return;
    }

    await supabase
      .from("komunitas")
      .update({ jumlah_anggota: k.jumlah_anggota + 1 })
      .eq("id", k.id);

    setKomunitas((prev) =>
      prev.map((item) =>
        item.id === k.id
          ? { ...item, sudahGabung: true, jumlah_anggota: item.jumlah_anggota + 1 }
          : item
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
      <div className="relative flex items-center justify-center px-10 py-8">
        <button
          onClick={() => router.back()}
          className="absolute left-8 p-1 hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer">
          <ArrowLeft size={32} color="#7D0A0A" />
        </button>
        <h1 className="text-3xl font-extrabold tracking-[1.5px] text-[#7D0A0A]">
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
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#7D0A0A]/30 border-t-[#7D0A0A] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((k) => (
            <KomunitasCard
              key={k.id}
              k={k}
              onGabung={() => handleGabung(k)}
              onOpen={() => router.push(`/Komunitas/${k.id}`)}/>
          ))}
        </div>
        )}
          
        {!loading && filtered.length === 0 && (
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
      style={{ backgroundColor: "rgba(248, 142, 142, 0.45)" }}>
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7D0A0A] flex items-center justify-center">
        <User size={30} color="#FCFAEE" strokeWidth={1.5} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#7D0A0A] text-md truncate">{k.nama}</p>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1 text-[#7D0A0A]/70">
            <Users size={16} />
            <span className="text-[14px] font-semibold">
              {k.jumlah_anggota.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#7D0A0A]/70">
            <MessageSquare size={16} />
            <span className="text-[14px] font-semibold">
              {k.jumlah_pesan.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {k.sudahGabung ? (
        <button
          onClick={onOpen}
          className="flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold bg-[#7D0A0A] text-white transition-all hover:bg-[#5c0808] active:scale-95">
          BUKA
        </button>
      ) : (
        <button
          onClick={onGabung}
          className="flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold bg-white text-[#7D0A0A] border border-[#7D0A0A]/20 transition-all hover:bg-[#7D0A0A] hover:text-white active:scale-95">
          GABUNG
        </button>
      )}
    </div>
  );
}