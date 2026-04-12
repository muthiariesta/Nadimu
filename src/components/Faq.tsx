"use client";
import { useState } from "react";

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

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className="py-20 px-8 md:px-16 lg:px-24 -mt-[1px]"
      style={{
        background: "linear-gradient(180deg, #F8E8E4 0%, #FAF0EA 100%)",
      }}
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
              style={{
                background: "rgba(244, 186, 186, 0.55)",
              }}
            >
              {/* Button Question */}
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-8 py-5 text-left font-bold text-[#7B1818]"
                style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}
              >
                <span>{faq.q}</span>

                <svg
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                  style={{ color: "#7B1818" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Answer */}
              <div
                className={`px-8 text-[#7B1818] transition-all duration-300 ${
                  isOpen ? "max-h-[200px] pb-6 opacity-80" : "max-h-0 opacity-0"
                } overflow-hidden`}
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