"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import MapHero from "@/components/Peta";

const GOLONGAN = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STOK_DATA = [
  {
    wilayah: "DKI Jakarta",
    units: [
      { kota: "JAKARTA PUSAT", nama: "PMI Pusat", gol: "A+", ada: 45, kap: 200 },
      { kota: "JAKARTA PUSAT", nama: "PMI Pusat", gol: "O-", ada: 12, kap: 50 },
      { kota: "JAKARTA SELATAN", nama: "PMI Pusat", gol: "A+", ada: 20, kap: 50 },
      { kota: "JAKARTA SELATAN", nama: "RS Kartika", gol: "B-", ada: 40, kap: 46 },
    ],
  },
  {
    wilayah: "Jawa Barat",
    units: [
      { kota: "KOTA BANDUNG", nama: "PMI Kota Bandung", gol: "A+", ada: 40, kap: 46 },
      { kota: "KOTA BANDUNG", nama: "RS Hasan Sadikin", gol: "A-", ada: 20, kap: 50 },
      { kota: "KOTA BOGOR", nama: "PMI Bogor", gol: "O+", ada: 30, kap: 60 },
      { kota: "KOTA BEKASI", nama: "PMI Bekasi", gol: "B+", ada: 26, kap: 80 },
    ],
  },
  {
    wilayah: "Jawa Tengah",
    units: [
      { kota: "KOTA SEMARANG", nama: "PMI Semarang", gol: "A+", ada: 35, kap: 80 },
      { kota: "D.I. YOGYAKARTA", nama: "PMI Yogyakarta", gol: "B-", ada: 18, kap: 40 },
      { kota: "KOTA SOLO", nama: "PMI Solo", gol: "O+", ada: 45, kap: 60 },
    ],
  },
  {
    wilayah: "Jawa Timur",
    units: [
      { kota: "KOTA SURABAYA", nama: "PMI Surabaya", gol: "O+", ada: 85, kap: 150 },
      { kota: "KOTA MALANG", nama: "PMI Malang", gol: "A+", ada: 55, kap: 80 },
      { kota: "KOTA KEDIRI", nama: "PMI Kediri", gol: "B+", ada: 35, kap: 60 },
    ],
  },
  {
    wilayah: "Sumatera Utara",
    units: [
      { kota: "KOTA MEDAN", nama: "PMI Medan", gol: "A+", ada: 15, kap: 100 },
      { kota: "KOTA MEDAN", nama: "RS Adam Malik", gol: "O-", ada: 8, kap: 50 },
      { kota: "KOTA BINJAI", nama: "PMI Binjai", gol: "B+", ada: 22, kap: 40 },
    ],
  },
  {
    wilayah: "Sumatera Selatan",
    units: [
      { kota: "KOTA PALEMBANG", nama: "PMI Palembang", gol: "AB+", ada: 35, kap: 60 },
      { kota: "KOTA LUBUKLINGGAU", nama: "PMI Lubuklinggau", gol: "O+", ada: 18, kap: 40 },
    ],
  },
  {
    wilayah: "Kalimantan Selatan",
    units: [
      { kota: "KOTA BANJARMASIN", nama: "PMI Banjarmasin", gol: "A+", ada: 22, kap: 80 },
      { kota: "KOTA BANJARBARU", nama: "PMI Banjarbaru", gol: "O+", ada: 38, kap: 50 },
    ],
  },
  {
    wilayah: "Kalimantan Timur",
    units: [
      { kota: "KOTA SAMARINDA", nama: "PMI Samarinda", gol: "O+", ada: 10, kap: 60 },
      { kota: "KOTA BALIKPAPAN", nama: "PMI Balikpapan", gol: "B+", ada: 25, kap: 50 },
    ],
  },
  {
    wilayah: "Sulawesi Selatan",
    units: [
      { kota: "KOTA MAKASSAR", nama: "PMI Makassar", gol: "A+", ada: 8, kap: 100 },
      { kota: "KOTA PAREPARE", nama: "PMI Parepare", gol: "O+", ada: 30, kap: 40 },
    ],
  },
  {
    wilayah: "Bali",
    units: [
      { kota: "KOTA DENPASAR", nama: "PMI Denpasar", gol: "A+", ada: 55, kap: 80 },
      { kota: "KAB. BADUNG", nama: "PMI Badung", gol: "O+", ada: 28, kap: 50 },
    ],
  },
  {
    wilayah: "Papua",
    units: [
      { kota: "KOTA JAYAPURA", nama: "PMI Jayapura", gol: "A+", ada: 18, kap: 60 },
      { kota: "KOTA JAYAPURA", nama: "RS Dok II", gol: "B+", ada: 25, kap: 50 },
      { kota: "KOTA MERAUKE", nama: "PMI Merauke", gol: "O+", ada: 8, kap: 40 },
    ],
  },
];

function getStatus(ada: number, kap: number) {
  const r = ada / kap;
  if (r < 0.25) return "kritis";
  if (r < 0.5) return "waspada";
  return "aman";
}

function getStatusColor(s: string) {
  if (s === "kritis") return { bg: "#FECACA", text: "#991B1B", dot: "#EF4444" };
  if (s === "waspada") return { bg: "#FEF08A", text: "#854D0E", dot: "#EAB308" };
  return { bg: "#BBF7D0", text: "#166534", dot: "#22C55E" };
}

function getStatusLabel(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PetaStokPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterGol, setFilterGol] = useState("Semua Gol.");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [openWilayah, setOpenWilayah] = useState<string | null>(null);

  const filtered = STOK_DATA.map((w) => ({
    ...w,
    units: w.units.filter((u) => {
      const matchGol = filterGol === "Semua Gol." || u.gol === filterGol;
      const matchStatus = filterStatus === "semua" || getStatus(u.ada, u.kap) === filterStatus;
      const matchSearch =
        search === "" ||
        w.wilayah.toLowerCase().includes(search.toLowerCase()) ||
        u.nama.toLowerCase().includes(search.toLowerCase()) ||
        u.kota.toLowerCase().includes(search.toLowerCase());
      return matchGol && matchStatus && matchSearch;
    }),
  })).filter((w) => w.units.length > 0);

  return (
    <div
      className="min-h-screen py-8 bg-[radial-gradient(ellipse_at_top_right,_#F88E8E_0%,_#FCFAEE_55%)] font-[family-name:var(--font-plus-jakarta)]"
    >
      <div className="flex items-center px-8 mb-4">
        <button onClick={() => router.back()} className="text-[#7D0A0A]">
          <ArrowLeft size={32} strokeWidth={2.5} />
        </button>
      </div>

      <p className="text-center font-bold text-2xl mb-5 px-8 text-[#7D0A0A]">
        Pantau Ketersediaan Stok Darah Di Seluruh Indonesia
      </p>

      <MapHero />

      <div className="px-8 mt-8">
        <h2 className="text-center text-xl font-black mb-8 text-[#7D0A0A]">
          PERSEBARAN STOK DARAH
        </h2>

        <div className="rounded-3xl p-6 mx-10 md:mx-20 md:p-8 bg-[#EA7B7B]/10 border-[1.5px] border-[#E0C5BC]">
          
          <div className="flex items-center gap-3 px-5 py-3 rounded-full mb-5 bg-[#FCFAEE] border-[1.5px] border-[#E0C5BC]">
            <Search size={16} className="text-[#9A6060]" />
            <input
              type="text"
              placeholder="Cari lokasi ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-[#7D0A0A]"
            />
          </div>

          <div className="flex gap-2 flex-wrap mb-3">
            {["Semua Gol.", ...GOLONGAN].map((g) => (
              <button
                key={g}
                onClick={() => setFilterGol(g)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-[1.5px] border-[#E0C5BC]
                  ${filterGol === g ? "bg-[#7D0A0A] text-[#FCFAEE]" : "bg-[#FCFAEE] text-[#7D0A0A]"}`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            {[
              { key: "semua", label: "Semua Status", activeBg: "bg-[#1CB49B]/80", activeText: "text-white" },
              { key: "kritis", label: "Kritis", activeBg: "bg-[#EA7B7B]/50", activeText: "text-[#7D0A0A]" },
              { key: "waspada", label: "Waspada", activeBg: "bg-[#FEF08A]", activeText: "text-[#7D0A0A]" },
              { key: "aman", label: "Aman", activeBg: "bg-[#7FB73C]/50", activeText: "text-[#7D0A0A]" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setFilterStatus(s.key)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all border-[1.5px] border-[#E0C5BC]
                  ${filterStatus === s.key ? `${s.activeBg} ${s.activeText}` : "bg-[#FCFAEE] text-[#9A6060]"}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <p className="text-sm font-semibold mb-4 text-[#7D0A0A]">
            {filtered.length} lokasi
          </p>

          <div className="flex flex-col gap-1">
            {filtered.map((w) => {
              const isOpen = openWilayah === w.wilayah;
              const totalAda = w.units.reduce((a, u) => a + u.ada, 0);
              const byKota: Record<string, typeof w.units> = {};
              w.units.forEach((u) => {
                if (!byKota[u.kota]) byKota[u.kota] = [];
                byKota[u.kota].push(u);
              });

              return (
                <div key={w.wilayah}>
                  <button
                    className="w-full flex items-center justify-between py-4 border-b border-[#E0C5BC]"
                    onClick={() => setOpenWilayah(isOpen ? null : w.wilayah)}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-[#7D0A0A]" />
                      <div className="text-left">
                        <p className="font-black text-sm text-[#7D0A0A]">{w.wilayah}</p>
                        <p className="text-xs text-[#9A6060]">
                          {w.units.length} unit &nbsp;|&nbsp; {totalAda} kantong
                        </p>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-[#7D0A0A]" /> : <ChevronDown size={18} className="text-[#7D0A0A]" />}
                  </button>

                  {isOpen && (
                    <div className="py-3 flex flex-col gap-4">
                      {Object.entries(byKota).map(([kota, units]) => (
                        <div key={kota}>
                          <p className="text-[10px] font-black tracking-widest mb-3 text-[#9A6060]">
                            {kota}
                          </p>
                          {units.map((u, i) => {
                            const st = getStatus(u.ada, u.kap);
                            const col = getStatusColor(st);
                            const pct = Math.round((u.ada / u.kap) * 100);
                            return (
                              <div
                                key={i}
                                className="flex items-center justify-between w-full py-3 border-b border-[#E0C5BC]"
                              >
                                <div className="w-[140px] shrink-0">
                                  <p className="font-bold text-sm text-[#7D0A0A]">{u.nama}</p>
                                  <p className="text-xs text-[#9A6060]">Gol. {u.gol}</p>
                                </div>

                                <div className="w-[80px] h-2.5 rounded-full overflow-hidden bg-[#EA7B7B]/20 shrink-0">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%`, backgroundColor: col.dot }}
                                  />
                                </div>

                                <div className="w-[100px] shrink-0">
                                  <p className="text-sm font-bold text-[#7D0A0A] text-center">
                                    {u.ada}/{u.kap} kantong
                                  </p>
                                </div>

                                <div className="w-[80px] shrink-0 flex justify-end">
                                  <span
                                    className="px-4 py-1.5 rounded-full text-[10px] font-bold min-w-[75px] text-center"
                                    style={{ backgroundColor: col.bg, color: col.text }}
                                  >
                                    {getStatusLabel(st)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}