"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Users, Megaphone, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Pesan {
  id: string;
  isi: string;
  dikirim_pada: string;
  pengirim_id: string;
  nama: string;
}
interface Komunitas {
  id: string;
  nama: string;
  jumlah_anggota: number;
}

function groupByDate(messages: Pesan[]) {
  const groups: { date: string; messages: Pesan[] }[] = [];
  messages.forEach((msg) => {
    const d = new Date(msg.dikirim_pada);
    const label = d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const last = groups[groups.length - 1];
    if (last && last.date === label) {
      last.messages.push(msg);
    } else {
      groups.push({ date: label, messages: [msg] });
    }
  });
  return groups;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function KomunitasChatPage() {
  const router = useRouter();
  const param = useParams();
  const komunitas_id = param.id as string;
  const bottomRef = useRef<HTMLDivElement>(null);
  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [komunitas, setKomunitas] = useState<Komunitas | null>(null);
  const [inputPesan, setInputPesan] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const { data: komunitasData } = await supabase
        .from("komunitas")
        .select("id, nama, jumlah_anggota")
        .eq("id", komunitas_id)
        .single();
      setKomunitas(komunitasData);

      const { data: pesanData, error } = await supabase
        .from("pesan_komunitas")
        .select("id, isi, dikirim_pada, pengirim_id")
        .eq("komunitas_id", komunitas_id)
        .order("dikirim_pada", { ascending: true });

      if (error) {
        console.error("Error fetch pesan:", error);
      } else {
        const formatted = (pesanData ?? []).map((p: any) => ({
          id: p.id,
          isi: p.isi,
          dikirim_pada: p.dikirim_pada,
          pengirim_id: p.pengirim_id,
          nama: p.profil?.nama ?? "Anonim",
        }));
        setPesan((formatted));
      }

      setLoading(false);
    };

    init();
  }, [komunitas_id]);

  useEffect(() => {
    const channel = supabase
      .channel(`pesan_komunitas:${komunitas_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pesan_komunitas",
          filter: `komunitas_id=eq.${komunitas_id}`,
        },
        async (payload) => {
          const { data: profil } = await supabase
            .from("profil")
            .select("nama")
            .eq("id", payload.new.pengirim_id)
            .single();
          const pesanBaru: Pesan = {
            id: payload.new.id,
            isi: payload.new.isi,
            dikirim_pada: payload.new.dikirim_pada ?? new Date().toISOString(),
            pengirim_id: payload.new.pengirim_id,
            nama: profil?.nama ?? "Anonim",
          };

          setPesan((prev) => [...prev, pesanBaru]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [komunitas_id]);

  const handleKirim = async () => {
    if (!inputPesan.trim() || !userId) return;
    const { data, error } = await supabase
      .from("pesan_komunitas")
      .insert({
        komunitas_id,
        pengirim_id: userId,
        isi: inputPesan,
      })
      .select();
      console.log("hasil insert:", data, error);
      
    if (error) {
      console.error("Gagal kirim:", error);
      return;
    }

    setInputPesan("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleKirim();
    }
  };

  const groups = groupByDate(pesan)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pesan]);



  return (
    <div
      className="flex flex-col h-screen"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "linear-gradient(135deg, #FDF0EE 0%, #FAE8E8 100%)",
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center gap-6 px-12 py-5 border-b border-[#F88E8E]/30"
        style={{ backgroundColor: "rgba(248, 142, 142, 0.3)" }}
      >
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-[#7D0A0A]/10 transition-colors"
        >
          <ArrowLeft size={32} className="text-[#7D0A0A]" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#7D0A0A] flex items-center justify-center flex-shrink-0 shadow-sm">
          <User size={32}/>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-[#7D0A0A] text-base leading-tight truncate">
            { komunitas?.nama }
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users size={12} className="text-[#7D0A0A]/60" />
            <span className="text-xs font-semibold text-[#7D0A0A]/60">
              {Number(komunitas?.jumlah_anggota ?? 0).toLocaleString("id-ID")} Anggota
            </span>
          </div>
        </div>

        <Megaphone size={26} className="text-[#7D0A0A]/70 flex-shrink-0" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-32 py-8">
        {groups.map((group) => (
          <div key={group.date}>
            <div className="flex justify-center my-6">
              <span className="px-6 py-2 rounded-full text-[10px] font-black tracking-widest text-white bg-[#7D0A0A]">
                {group.date}
              </span>
            </div>

            {group.messages.map((msg, i) => {
              const isMe = msg.pengirim_id === userId;
              const showSender =
                !isMe &&
                (i === 0 || group.messages[i - 1].pengirim_id !== msg.pengirim_id);

              return (
                <div key={msg.id} className={`mb-5 ${isMe ? "flex justify-end" : ""}`}>
                  {!isMe && showSender && (
                    <p className="text-[13px] font-black text-[#7D0A0A] mb-2 ml-1">
                      {msg.nama}
                    </p>
                  )}
                  <div
                    className={`relative max-w-[65%] px-5 py-4 rounded-2xl shadow-sm ${
                      isMe
                        ? "bg-[#7D0A0A] text-white rounded-br-none"
                        : "rounded-bl-none"
                    }`}
                    style={isMe ? {} : { backgroundColor: "rgba(248, 142, 142, 0.35)" }}
                  >
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        isMe ? "text-white" : "text-[#7D0A0A]"
                      }`}
                    >
                      {msg.isi}
                    </p>
                    <p className="text-[10px] font-bold text-right mt-2 opacity-60">
                      {formatTime(msg.dikirim_pada)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-32 py-4">
        <div
          className="flex items-center gap-3 px-6 py-2 rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            border: "1.5px solid #7D0A0A",
            boxShadow: "0px 4px 20px rgba(125,10,10,0.08)",
          }}
        >
          <input
            type="text"
            value={inputPesan}
            placeholder="Kirim Pesan..."
            className="flex-1 bg-transparent outline-none text-sm text-[#7D0A0A] placeholder:text-[#7D0A0A]/40 font-medium py-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            onChange={(e) => setInputPesan(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter"){
                e.preventDefault();
                handleKirim();
              }
            }
          }
          />
          <button onClick={handleKirim}>
            <Send size={24}className="text-[#7D0A0A] translate-x-0.5"/>
          </button>
        </div>
      </div>
    </div>
  );
}