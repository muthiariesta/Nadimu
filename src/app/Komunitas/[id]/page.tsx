"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Users, Megaphone } from "lucide-react";

interface Pesan {
  id: string;
  isi: string;
  dikirim_pada: string;
  pengirim_id: string;
  nama: string;
}

const DUMMY_MESSAGES: Pesan[] = [
  {
    id: "1",
    isi: "Update: Donor O- Untuk RS Harapan Kita Sudah Terpenuhi! Terima Kasih Banyak Untuk 6 Orang Yang Datang Hari Ini. Kalian Pahlawan!",
    dikirim_pada: "2026-03-04T19:45:00",
    pengirim_id: "user-1",
    nama: "Roojie Kham Bung",
  },
  {
    id: "2",
    isi: "Jangan Lupa Bagi Pendaftar Event Hari Donor Darah Nasional Untuk:\n\n• Istirahat Yang Cukup\n• Datang Pada Waktu Yang Tertera\n\nAkan Ada Undian Menarik Yang Dibagikan Oleh Petugas Saat Registrasi Ulang",
    dikirim_pada: "2026-03-10T23:59:00",
    pengirim_id: "user-2",
    nama: "John Forum",
  },
];

const CURRENT_USER_ID = "me";

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const groups = groupByDate(DUMMY_MESSAGES);

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
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-[#7D0A0A] text-base leading-tight truncate">
            Pendonor Gen Z Jember
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users size={12} className="text-[#7D0A0A]/60" />
            <span className="text-xs font-semibold text-[#7D0A0A]/60">37 Anggota</span>
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
                {group.date.toUpperCase()}
              </span>
            </div>

            {group.messages.map((msg, i) => {
              const isMe = msg.pengirim_id === CURRENT_USER_ID;
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
            placeholder="Kirim Pesan..."
            className="flex-1 bg-transparent outline-none text-sm text-[#7D0A0A] placeholder:text-[#7D0A0A]/40 font-medium py-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
          <button
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all"
            style={{ backgroundColor: "#7D0A0A" }}
          >
            <Send size={14} className="text-white translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}