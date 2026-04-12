"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
  color: string;
}

interface DonorHistory {
  pmi: string;
  date: string;
  points: number;
}

interface RewardItem {
  id: string;
  icon: string;
  title: string;
  provider: string;
  points: number;
  providerIcon: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const USER = {
  name: "Benedicta Sherin",
  email: "benedictpresley@gmail.com",
  bloodType: "O+",
  region: "Tambun Selatan",
  joinDate: "Bergabung Februari 2024",
  donorCount: 4,
  totalPoints: 1000,
  shareText: "Bagikan pencapaianmu dan ajak orang lain untuk jadi penyelamat",
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-blood",
    icon: "🩸",
    title: "First Blood",
    desc: "Donor pertama kali",
    unlocked: true,
    color: "bg-rose-100 border-rose-300 text-rose-700",
  },
  {
    id: "on-streak",
    icon: "🔥",
    title: "On Streak",
    desc: "Tiga kali donor berturut-turut",
    unlocked: true,
    color: "bg-orange-100 border-orange-300 text-orange-700",
  },
  {
    id: "live-saver",
    icon: "💊",
    title: "Live Saver",
    desc: "Lima kali donor",
    unlocked: false,
    color: "bg-gray-100 border-gray-200 text-gray-400",
  },
  {
    id: "rare-hero",
    icon: "⭐",
    title: "Rare Hero",
    desc: "Menyumbang golongan darah langka",
    unlocked: false,
    color: "bg-gray-100 border-gray-200 text-gray-400",
  },
];

const DONOR_HISTORY: DonorHistory[] = [
  { pmi: "PMI Bekasi", date: "12 Des 2025", points: 200 },
  { pmi: "PMI Tambun", date: "3 Sep 2025", points: 200 },
  { pmi: "PMI Bekasi", date: "20 Jun 2025", points: 200 },
  { pmi: "RS Adam Malik", date: "1 Mar 2025", points: 200 },
];

const REWARDS: RewardItem[] = [
  {
    id: "checkup",
    icon: "🏥",
    title: "Medical Check-Up Gratis",
    provider: "RS Hermina",
    points: 1500,
    providerIcon: "🏨",
  },
  {
    id: "pin",
    icon: "📌",
    title: "Enamel Pin PMI",
    provider: "PMI Terdekat",
    points: 1000,
    providerIcon: "🩸",
  },
  {
    id: "sembako",
    icon: "🛒",
    title: "Hampers Sembako",
    provider: "PMI Terdekat",
    points: 1000,
    providerIcon: "🩸",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar() {
  return (
    <div className="relative w-16 h-16 rounded-full bg-[#7A1A1A] flex items-center justify-center flex-shrink-0 shadow-md">
      <svg viewBox="0 0 24 24" className="w-9 h-9 text-rose-200" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

function DonorBadge({ count }: { count: number }) {
  return (
    <div className="bg-[#7A1A1A] text-white rounded-xl px-5 py-3 text-center shadow-lg min-w-[90px]">
      <p className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-0.5">Donor</p>
      <p className="text-4xl font-black leading-none">{count}X</p>
    </div>
  );
}

function AchievementCard({ a }: { a: Achievement }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
        a.unlocked
          ? "bg-white border-rose-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          : "bg-gray-50 border-gray-200 opacity-60"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
          a.unlocked ? "bg-rose-100" : "bg-gray-100"
        }`}
      >
        <span className={a.unlocked ? "" : "grayscale"}>{a.icon}</span>
      </div>
      <div>
        <p className={`text-sm font-bold ${a.unlocked ? "text-[#3D0A0A]" : "text-gray-400"}`}>
          {a.title}
        </p>
        <p className={`text-xs ${a.unlocked ? "text-rose-500" : "text-gray-400"}`}>{a.desc}</p>
      </div>
    </div>
  );
}

function HistoryRow({ h, isFirst }: { h: DonorHistory; isFirst: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        !isFirst ? "border-t border-rose-100" : ""
      }`}
    >
      <div>
        <p className="text-sm font-bold text-[#3D0A0A]">{h.pmi}</p>
        <p className="text-xs text-rose-400 mt-0.5">{h.date}</p>
      </div>
      <span className="text-sm font-bold text-[#7A1A1A] bg-rose-50 px-3 py-1 rounded-full">
        +{h.points} poin
      </span>
    </div>
  );
}

function RewardCard({ r, userPoints }: { r: RewardItem; userPoints: number }) {
  const canAfford = userPoints >= r.points;
  const [redeemed, setRedeemed] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="p-4 flex-1">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-xl mb-3">
          {r.icon}
        </div>
        <p className="text-sm font-bold text-[#3D0A0A] leading-tight mb-2">{r.title}</p>
        <div className="flex items-center gap-1 text-xs text-rose-500 mb-1">
          <span>{r.providerIcon}</span>
          <span>{r.provider}</span>
        </div>
        <p className="text-xs font-bold text-[#7A1A1A]">{r.points.toLocaleString("id")} poin</p>
      </div>
      <button
        suppressHydrationWarning
        disabled={!canAfford || redeemed}
        onClick={() => canAfford && setRedeemed(true)}
        className={`w-full py-2.5 text-xs font-black tracking-widest uppercase transition-all duration-200 ${
          redeemed
            ? "bg-green-500 text-white cursor-default"
            : canAfford
            ? "bg-[#7A1A1A] text-white hover:bg-[#5A0E0E] active:scale-95"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {redeemed ? "✓ Ditukar" : "Tukarkan"}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard?.writeText("Ayo donor darah bersama Nadimu! 🩸").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const visibleHistory = historyOpen ? DONOR_HISTORY : DONOR_HISTORY.slice(0, 1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
      `}</style>

      <div className="min-h-screen bg-[#FDF5F2] p-4 md:p-8">
        {/* Back nav */}
        <div className="max-w-5xl mx-auto">
          <button
            suppressHydrationWarning
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-rose-400 hover:text-[#7A1A1A] mb-4 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Profil
          </button>

          {/* ── Profile card ─────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-5 md:p-7 mb-5">
            <div className="flex flex-wrap items-start gap-4 mb-4">
              {/* Avatar + info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div>
                  <Avatar />
                  <button
                    suppressHydrationWarning
                    onClick={() => setEditMode(!editMode)}
                    className="text-[10px] text-rose-400 hover:text-[#7A1A1A] mt-1.5 block text-center w-full transition-colors"
                  >
                    Edit Profil
                  </button>
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-black text-[#3D0A0A] leading-tight">{USER.name}</h1>
                  <p className="text-xs text-rose-400 mt-0.5">{USER.email}</p>
                  <p className="text-xs text-rose-400 mt-0.5">
                    {USER.bloodType} | {USER.region} | {USER.joinDate}
                  </p>
                  <button
                    suppressHydrationWarning
                    onClick={handleShare}
                    className="flex items-center gap-2 mt-2 text-xs text-[#7A1A1A] bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full px-3 py-1 transition-all"
                  >
                    <span className="truncate max-w-[200px] md:max-w-xs">{USER.shareText}</span>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {copied && (
                    <p className="text-[10px] text-green-500 mt-1">Link disalin!</p>
                  )}
                </div>
              </div>

              {/* Donor badge */}
              <DonorBadge count={USER.donorCount} />
            </div>

            {/* ── Two-column grid ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

              {/* Pencapaian */}
              <div>
                <h2 className="text-sm font-black text-[#3D0A0A] mb-3 uppercase tracking-wider">
                  Pencapaian
                </h2>
                <div className="flex flex-col gap-2">
                  {ACHIEVEMENTS.map((a) => (
                    <AchievementCard key={a.id} a={a} />
                  ))}
                </div>
              </div>

              {/* Riwayat Donor + Tukar Poin */}
              <div className="flex flex-col gap-4">

                {/* Riwayat Donor */}
                <div className="bg-[#FDF5F2] rounded-2xl border border-rose-100 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-black text-[#3D0A0A] uppercase tracking-wider">
                      Riwayat Donor
                    </h2>
                    <button
                      suppressHydrationWarning
                      onClick={() => setHistoryOpen(!historyOpen)}
                      className="text-rose-400 hover:text-[#7A1A1A] transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-4 h-4 transition-transform duration-200 ${historyOpen ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {visibleHistory.map((h, i) => (
                    <HistoryRow key={i} h={h} isFirst={i === 0} />
                  ))}
                  {!historyOpen && DONOR_HISTORY.length > 1 && (
                    <button
                      suppressHydrationWarning
                      onClick={() => setHistoryOpen(true)}
                      className="text-xs text-rose-400 hover:text-[#7A1A1A] mt-1 transition-colors"
                    >
                      Lihat semua ({DONOR_HISTORY.length}) →
                    </button>
                  )}
                </div>

                {/* Tukar Poin */}
                <div className="bg-[#FDF5F2] rounded-2xl border border-rose-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-sm font-black text-[#3D0A0A] uppercase tracking-wider">
                        Tukar Poin
                      </h2>
                      <span className="bg-[#7A1A1A] text-white text-xs font-bold px-3 py-0.5 rounded-full">
                        {USER.totalPoints.toLocaleString("id")} poin
                      </span>
                    </div>
                    <button
                      suppressHydrationWarning
                      onClick={() => setRewardOpen(!rewardOpen)}
                      className="text-rose-400 hover:text-[#7A1A1A] transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-4 h-4 transition-transform duration-200 ${rewardOpen ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {REWARDS.map((r) => (
                      <RewardCard key={r.id} r={r} userPoints={USER.totalPoints} />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
