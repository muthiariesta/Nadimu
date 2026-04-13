"use client";
import { supabase } from "@/lib/supabase";
import CardKegiatan from "@/components/CardKegiatan";
import CardBerita from "@/components/CardBerita";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsItem {
  judul: string;
  slug: string;
  gambar_url: string;
  isi: string;
}

interface Region {
  name: string;
  kantong: number;
  x: string;
  y: string;
  labelX: string;
  labelY: string;
}

const stats = [
  { value: 10000, label: "Pendonor Aktif" },
  { value: 3500, label: "Nyawa Terselamatkan" },
  { value: 2000, label: "Mitra Kesehatan" },
  { value: 400, label: "Event Donor" },
];

const regions: Region[] = [
  { name: "SUMATERA", kantong: 10, x: "14%", y: "52%", labelX: "2%", labelY: "72%" },
  { name: "JAWA", kantong: 25, x: "30%", y: "70%", labelX: "20%", labelY: "84%" },
  { name: "BALI", kantong: 25, x: "40%", y: "76%", labelX: "32%", labelY: "90%" },
  { name: "KALIMANTAN", kantong: 10, x: "42%", y: "36%", labelX: "35%", labelY: "16%" },
  { name: "SULAWESI", kantong: 15, x: "60%", y: "38%", labelX: "55%", labelY: "18%" },
  { name: "NTT", kantong: 15, x: "57%", y: "72%", labelX: "57%", labelY: "84%" },
  { name: "PAPUA", kantong: 10, x: "84%", y: "50%", labelX: "77%", labelY: "30%" },
];

const faqs = [
  {
    q: "Bagaimana Cara Menjadi Pendonor?",
    a: "Pengguna dapat mendaftar sebagai pendonor dengan membuat akun dan melengkapi profil seperti golongan darah, lokasi, dan riwayat donor. Setelah itu, pendonor dapat melihat permintaan darah atau mengikuti kegiatan donor darah yang tersedia.",
  },
  {
    q: "Bagaimana Cara Mendapatkan Kantong Darah?",
    a: "Pengguna dapat mengajukan kebutuhan darah dengan mengisi informasi seperti golongan darah, jumlah kebutuhan, dan lokasi rumah sakit. Sistem kemudian akan membantu mencocokkan kebutuhan tersebut dengan stok darah yang tersedia atau pendonor terdekat.",
  },
  {
    q: "Bagaimana Cara Mengetahui Ketersediaan Stok Darah?",
    a: "Pengguna dapat melihat informasi ketersediaan stok darah melalui peta atau daftar wilayah yang tersedia di platform. Informasi ini membantu pengguna mengetahui lokasi terdekat yang memiliki stok darah yang dibutuhkan.",
  },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [layananOpen, setLayananOpen] = useState(false);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setLayananOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between bg-[#F88E90]/60 backdrop-blur-md shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("beranda")}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 4C18 4 8 14 8 21.5C8 27.299 12.701 32 18 32C23.299 32 28 27.299 28 21.5C28 14 18 4Z" fill="#8B1A1A" />
          <path d="M18 10C18 10 12 17 12 21.5C12 24.538 14.686 27 18 27C21.314 27 24 24.538 24 21.5C24 17 18 10Z" fill="#F4A0A0" opacity="0.6" />
          <path d="M15 22C15 22 16 19 18 18C20 17 21.5 19 21.5 21C21.5 23 20 24.5 18 24.5" stroke="#8B1A1A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[#8B1A1A] font-bold text-xl tracking-wide">Nadimu</span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">

        {/* Beranda */}
        <button
          suppressHydrationWarning
          onClick={() => scrollTo("beranda")}
          className="text-[#8B1A1A] font-medium hover:opacity-70 transition-opacity"
        >
          Beranda
        </button>

      {/* Layanan — dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setLayananOpen(true)}
        onMouseLeave={() => setLayananOpen(false)}
      >
        <button
          suppressHydrationWarning
          className="flex items-center gap-1 text-[#8B1A1A] font-medium hover:opacity-70 transition-opacity"
        >
          Layanan
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            className={`transition-transform duration-200 ${layananOpen ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Jembatan invisible supaya hover tidak putus saat kursor turun ke dropdown */}
        <div className="absolute top-full left-0 right-0 h-3" />

        {layananOpen && (
          <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-rose-100 overflow-hidden min-w-[160px] z-50">
            <button
              suppressHydrationWarning
              onClick={() => scrollTo("beranda")}
              className="w-full text-left px-5 py-3 text-sm font-semibold text-[#8B1A1A] hover:bg-rose-50 transition-colors flex items-center gap-2"
            >
              Donor Darah
            </button>
            <div className="border-t border-rose-100" />
            <button
              suppressHydrationWarning
              onClick={() => scrollTo("cari-donor")}
              className="w-full text-left px-5 py-3 text-sm font-semibold text-[#8B1A1A] hover:bg-rose-50 transition-colors flex items-center gap-2"
            >
              Cari Donor
            </button>
          </div>
        )}
      </div>

        {/* Kegiatan */}
        <button
          suppressHydrationWarning
          onClick={() => scrollTo("kegiatan")}
          className="text-[#8B1A1A] font-medium hover:opacity-70 transition-opacity"
        >
          Kegiatan
        </button>

        {/* Berita */}
        <button
          suppressHydrationWarning
          onClick={() => scrollTo("berita")}
          className="text-[#8B1A1A] font-medium hover:opacity-70 transition-opacity"
        >
          Berita
        </button>

        {/* Persebaran */}
        <button
          suppressHydrationWarning
          onClick={() => scrollTo("persebaran")}
          className="text-[#8B1A1A] font-medium hover:opacity-70 transition-opacity"
        >
          Persebaran
        </button>
      </div>

      {/* Masuk button */}
      <Link
        href="/login"
        className="hidden md:block bg-[#8B1A1A] text-white font-bold tracking-widest px-8 py-3 rounded-full hover:bg-[#6B1010] transition-colors"
      >
        MASUK
      </Link>

      {/* Mobile hamburger */}
      <button
        suppressHydrationWarning
        className="md:hidden text-[#8B1A1A]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#f5e8e8] shadow-lg p-6 flex flex-col gap-2 md:hidden">
          {[
            { label: "Beranda", id: "beranda" },
            { label: "Kegiatan", id: "kegiatan" },
            { label: "Berita", id: "berita" },
            { label: "Persebaran", id: "persebaran" },
          ].map((item) => (
            <button
              suppressHydrationWarning
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[#8B1A1A] font-medium text-lg text-left py-1 hover:opacity-70 transition-opacity"
            >
              {item.label}
            </button>
          ))}
          {/* Layanan mobile — expanded inline */}
          <div className="flex flex-col gap-1 pl-3 border-l-2 border-rose-300">
            <p className="text-[#8B1A1A] font-bold text-sm opacity-60 uppercase tracking-wider">Layanan</p>
            <button
              suppressHydrationWarning
              onClick={() => scrollTo("beranda")}
              className="text-[#8B1A1A] font-medium text-lg text-left py-1 hover:opacity-70"
            >
              🩸 Donor Darah
            </button>
            <button
              suppressHydrationWarning
              onClick={() => scrollTo("cari-donor")}
              className="text-[#8B1A1A] font-medium text-lg text-left py-1 hover:opacity-70"
            >
              🔍 Cari Donor
            </button>
          </div>
          <Link
            href="/login"
            className="bg-[#8B1A1A] text-white font-bold tracking-widest px-8 py-3 rounded-full mt-2 text-center"
          >
            MASUK
          </Link>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const countersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll("[data-target]");
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute("data-target") ?? "0");
              let current = 0;
              const step = target / 60;
              const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString("id-ID");
              }, 20);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (countersRef.current) observer.observe(countersRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="beranda" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 30%, #C8726A 0%, #D4918A 25%, #E8B4AE 50%, #F2D5CF 70%, #F8EDE8 90%, #FAF0EB 100%)",
        }}
      />
      <div
        className="absolute top-16 right-16 w-72 h-72 rounded-full -z-10 opacity-20"
        style={{ background: "radial-gradient(circle, #8B1A1A 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div className="px-8 md:px-16 lg:px-24 pt-5 pb-16">
        <div className="max-w-3xl">
          <h1
            className="font-extrabold text-[#8B1A1A] leading-tight mb-6"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
          >
            Setiap Tetes Darahmu Menyelamatkan
            <br />
            yang Membutuhkan
          </h1>
          <p className="text-[#8B1A1A] text-lg md:text-xl opacity-80 mb-10 max-w-xl leading-relaxed">
            Platform yang menghubungkan pendonor dan pencari darah secara real-time dan terintegrasi di seluruh Indonesia
          </p>
          <Link
            href="/Login"
            className="inline-block bg-[#8B1A1A] text-white font-bold tracking-widest px-10 py-4 rounded-full hover:bg-[#6B1010] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#8B1A1A]/30"
          >
            DONOR SEKARANG
          </Link>
        </div>

        <div
          ref={countersRef}
          className="mt-10 mx-auto bg-[#F4BABA]/50 backdrop-blur-sm rounded-3xl px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#8B1A1A]/20"
          style={{ maxWidth: 900 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-extrabold text-[#8B1A1A] mb-1" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
                <span data-target={stat.value}>0</span>
              </div>
              <p className="text-[#8B1A1A] opacity-70 font-medium text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FindDonor ────────────────────────────────────────────────────────────────

function FindDonor() {
  return (
    <section id="cari-donor" className="relative py-32 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, #F5DDD8 0%, #FAF0EB 60%, #FAF0EB 100%)",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full -z-10 opacity-30"
        style={{ background: "radial-gradient(circle, #D4918A 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div className="text-center px-8 max-w-3xl mx-auto">
        <h2
          className="font-extrabold text-[#8B1A1A] tracking-wider mb-6 uppercase"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
        >
          Temukan Pendonor Lebih Cepat
        </h2>
        <p className="text-[#8B1A1A] opacity-70 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Kami membantu menghubungkan pendonor darah dengan orang yang membutuhkan agar proses pencarian donor dapat dilakukan dengan lebih mudah dan cepat.
        </p>
        <Link
          href="/Login"
          className="inline-block bg-[#8B1A1A] text-white font-bold tracking-widest px-10 py-4 rounded-full hover:bg-[#6B1010] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#8B1A1A]/30"
        >
          DONOR SEKARANG
        </Link>
      </div>
    </section>
  );
}


function Kegiatan() {
  const router = useRouter();
  const [kegiatanItems, setKegiatanItems] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("event_donor")
        .select("id, nama_event, tanggal, lokasi, gambar_url, kuota, institusi:penyelenggara_id(nama_institusi)")
        .eq("status", "aktif")
        .limit(3);  // hanya tampil 3 di beranda
      if (data) setKegiatanItems(data as any[]);
    };
    fetch();
  }, []);

  return (
    <section
      id="kegiatan"
      className="py-20 px-4 md:px-12 lg:px-20"
      style={{ background: "linear-gradient(180deg, #FAF0EB 0%, #FAF0EA 100%)" }}
    >
      <h2
        className="text-center font-extrabold text-[#7B1818] uppercase tracking-wider mb-14"
        style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
      >
        Kegiatan Yang Sedang Berlangsung
      </h2>

      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-10">
        {kegiatanItems.map((item) => (
          <CardKegiatan
            key={item.id}
            gambar_url={item.gambar_url}
            nama_penyelenggara={item.institusi?.nama_institusi ?? "-"}
            kuota={item.kuota}
            nama_event={item.nama_event}
            tanggal={item.tanggal}
            lokasi={item.lokasi}
            onDetail={() => router.push(`/Kegiatan/${item.id}`)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          href="/Kegiatan"
          className="inline-block bg-[#7B1818] text-white font-black tracking-widest px-12 py-4 rounded-full hover:bg-[#5B0E0E] hover:scale-105 transition-all duration-300 shadow-lg"
          style={{ fontSize: "0.85rem", letterSpacing: "0.2em" }}
        >
          LIHAT SELENGKAPNYA
        </Link>
      </div>
    </section>
  );
}

// ─── Berita ───────────────────────────────────────────────────────────────────



function Berita() {
  const router = useRouter();
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const visible = 3;

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("berita")
        .select("judul, slug, isi, gambar_url")
        .limit(5);  // ambil 5 supaya carousel bisa geser
      if (data) setNewsItems(data);
    };
    fetch();
  }, []);

  const max = Math.max(0, newsItems.length - visible);
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, max));

  return (
    <section
      id="berita"
      className="py-20 px-4 md:px-12 lg:px-20 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FAF0EB 0%, #FAF0EA 100%)" }}
    >
      <h2
        className="text-center font-extrabold text-[#7B1818] uppercase tracking-wider mb-14"
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
      >
        Berita
      </h2>

      <div className="relative max-w-6xl mx-auto flex items-center gap-4">
        <button
          suppressHydrationWarning
          onClick={prev}
          disabled={current === 0}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7B1818] text-white flex items-center justify-center hover:bg-[#5B0E0E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500"
            style={{
              transform: `translateX(calc(-${current * (100 / visible)}% - ${current * (16 / visible)}px))`,
            }}
          >
            {newsItems.map((item) => (
              <div
                key={item.slug}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / visible}% - ${((visible - 1) * 16) / visible}px)` }}
              >
                <CardBerita
                  judul={item.judul}
                  slug={item.slug}
                  isi={item.isi}
                  gambar_url={item.gambar_url}
                  onClick={(slug) => router.push(`/Berita/${slug}`)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          suppressHydrationWarning
          onClick={next}
          disabled={current === max}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7B1818] text-white flex items-center justify-center hover:bg-[#5B0E0E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

// ─── BloodMap ─────────────────────────────────────────────────────────────────

function BloodMap() {
  return (
    <section id="persebaran" className="py-20 px-8 md:px-16" style={{ background: "linear-gradient(135deg, #FAF0EA 0%, #F5E0DA 100%)" }}>
      <h2
        className="text-center font-bold text-[#7B1818] mb-16"
        style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}
      >
        Pantau Ketersediaan Stok Darah Di Seluruh Indonesia
      </h2>

      <div className="relative max-w-5xl mx-auto" style={{ height: 500 }}>
        <svg
          viewBox="0 0 900 400"
          className="absolute inset-0 w-full h-full"
          style={{ filter: "drop-shadow(4px 6px 12px rgba(123,24,24,0.25))" }}
        >
          {/* Sumatera */}
          <path d="M80,160 Q90,140 110,130 Q130,120 155,125 Q180,130 195,150 Q210,170 205,195 Q200,220 185,240 Q170,260 150,270 Q130,280 110,270 Q90,260 80,240 Q68,215 72,190 Q76,170 80,160Z" fill="#8B1A1A" />
          {/* Jawa */}
          <path d="M195,250 Q220,242 255,240 Q290,238 325,242 Q355,246 375,255 Q390,264 388,278 Q385,292 360,298 Q330,304 295,302 Q260,300 230,294 Q205,288 198,275 Q192,262 195,250Z" fill="#8B1A1A" />
          {/* Bali + Lombok */}
          <ellipse cx="410" cy="275" rx="18" ry="14" fill="#8B1A1A" />
          <ellipse cx="435" cy="278" rx="12" ry="10" fill="#8B1A1A" />
          {/* Kalimantan */}
          <path d="M280,80 Q310,65 345,68 Q385,72 415,88 Q445,105 455,130 Q462,155 450,178 Q438,200 415,210 Q390,220 360,215 Q330,210 305,195 Q278,178 270,155 Q262,130 268,108 Q273,90 280,80Z" fill="#8B1A1A" />
          {/* Sulawesi */}
          <path d="M490,90 Q505,80 522,85 Q538,90 545,108 Q552,125 545,148 Q538,168 525,178 Q512,188 498,182 Q485,175 480,158 Q475,140 480,120 Q484,102 490,90Z M525,145 Q540,138 555,145 Q568,152 570,168 Q572,184 562,195 Q550,205 537,200 Q524,195 520,180 Q517,165 525,145Z" fill="#8B1A1A" />
          {/* Maluku */}
          <ellipse cx="575" cy="210" rx="14" ry="10" fill="#8B1A1A" opacity="0.8" />
          <ellipse cx="600" cy="225" rx="10" ry="8" fill="#8B1A1A" opacity="0.8" />
          {/* NTT */}
          <ellipse cx="480" cy="270" rx="22" ry="10" fill="#8B1A1A" />
          <ellipse cx="520" cy="278" rx="18" ry="9" fill="#8B1A1A" />
          <ellipse cx="555" cy="272" rx="14" ry="8" fill="#8B1A1A" />
          {/* Papua */}
          <path d="M650,110 Q690,95 730,100 Q768,106 790,128 Q810,150 808,178 Q805,205 785,222 Q762,238 735,240 Q705,242 680,228 Q654,213 643,188 Q633,162 638,138 Q643,118 650,110Z" fill="#8B1A1A" />
          <path d="M790,140 Q812,135 830,148 Q845,162 840,180 Q834,197 818,202 Q802,207 793,194 Q784,180 787,162 Q789,148 790,140Z" fill="#8B1A1A" />

          {regions.map((r) => {
            const cx = parseFloat(r.x) * 9;
            const cy = parseFloat(r.y) * 4;
            const lx = parseFloat(r.labelX) * 9 + 40;
            const ly = parseFloat(r.labelY) * 4 + 12;
            return (
              <g key={r.name}>
                <line x1={cx} y1={cy} x2={lx} y2={ly} stroke="#7B1818" strokeWidth="1" />
                <circle cx={cx} cy={cy} r="5" fill="white" stroke="#7B1818" strokeWidth="2" />
              </g>
            );
          })}
        </svg>

        {regions.map((r) => (
          <div
            key={r.name}
            className="absolute"
            style={{ left: r.labelX, top: r.labelY, transform: "translate(-50%, -50%)" }}
          >
            <div className="bg-[#F4BABA]/80 backdrop-blur-sm rounded-2xl px-4 py-2 text-center whitespace-nowrap shadow-sm border border-[#F4BABA]">
              <div className="font-extrabold text-[#7B1818] text-sm tracking-wider">{r.name}</div>
              <div className="text-[#7B1818] text-sm">
                <span className="font-bold">{r.kantong}</span>{" "}
                <span className="italic opacity-70 text-xs">KANTONG</span>
              </div>
            </div>
          </div>
        ))}

        <p className="absolute bottom-0 right-0 text-[#7B1818] opacity-50 text-xs italic">
          *Data Stok Darah Diperbarui Secara Berkala
        </p>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className="py-20 px-8 md:px-16 lg:px-24 -mt-[1px]"
      style={{ background: "linear-gradient(180deg, #F8E8E4 0%, #FAF0EA 100%)" }}
    >
      <h2
        className="text-center font-extrabold text-[#7B1818] uppercase tracking-wider mb-14"
        style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
      >
        PERTANYAAN UMUM
      </h2>
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{ background: "rgba(244, 186, 186, 0.55)" }}
            >
              <button
                suppressHydrationWarning
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-8 py-5 text-left font-bold text-[#7B1818]"
                style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}
              >
                <span>{faq.q}</span>
                <svg
                  width="22" height="22" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2.5}
                  className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                  style={{ color: "#7B1818" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`px-8 text-[#7B1818] transition-all duration-300 ${isOpen ? "max-h-[200px] pb-6 opacity-80" : "max-h-0 opacity-0"} overflow-hidden`}
              >
                <p className="text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-10 px-8" style={{ background: "#7B1818" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
          <div className="flex items-center gap-3 text-white">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="white" strokeWidth={0} />
            </svg>
            <span className="font-medium text-base">@nadimu</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span className="font-medium text-base">08123456789</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="font-medium text-base">nadimu@gmail.com</span>
          </div>
        </div>
        <div className="border-t border-white/20 mb-5" />
        <p className="text-center text-white/80 text-sm">
          ©2026 Nadimu. Hak cipta dilindungi undang-undang.
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FindDonor />
      <Kegiatan />
      <Berita />
      <BloodMap />
      <FAQ />
      <Footer />
    </main>
  );
}
