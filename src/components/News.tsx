"use client";

import { useState } from "react";
import CardBerita from "@/components/CardBerita";

const newsItems = [
  {
    judul: "Tips Donor Darah Untuk Pemula",
    slug: "tips-donor-darah-untuk-pemula",
    gambar_url: "https://placehold.co/360x200/F4BABA/7B1818?text=Tips+Donor+Darah&font=roboto",
    isi: "Donor darah merupakan salah satu bentuk kepedulian sosial yang dapat membantu menyelamatkan nyawa orang lain. Bagi sebagian orang",
  },
  {
    judul: "Manfaat Donor Darah Bagi Kesehatan Tubuh",
    slug: "manfaat-donor-darah",
    gambar_url: "https://placehold.co/360x200/F4BABA/7B1818?text=Manfaat+Donor+Darah&font=roboto",
    isi: "Donor darah tidak hanya menyelamatkan nyawa orang lain, tetapi juga memberikan berbagai manfaat bagi kesehatan pendonor.",
  },
  {
    judul: "Cerita Pasien yang Tertolong Berkat Donor Darah",
    slug: "cerita-pasien-tertolong",
    gambar_url: "https://placehold.co/360x200/F4BABA/7B1818?text=Cerita+Pasien&font=roboto",
    isi: "Bagi banyak orang, donor darah mungkin hanya membutuhkan waktu beberapa menit. Namun bagi sebagian pasien, satu kantong",
  },
  {
    judul: "Syarat dan Ketentuan Menjadi Pendonor Darah",
    slug: "syarat-ketentuan-pendonor",
    gambar_url: "https://placehold.co/360x200/F4BABA/7B1818?text=Syarat+Pendonor&font=roboto",
    isi: "Sebelum melakukan donor darah, ada beberapa syarat kesehatan yang perlu dipenuhi oleh calon pendonor agar prosesnya aman.",
  },
  {
    judul: "Golongan Darah Langka di Indonesia",
    slug: "golongan-darah-langka",
    gambar_url: "https://placehold.co/360x200/F4BABA/7B1818?text=Golongan+Darah&font=roboto",
    isi: "Beberapa golongan darah terbilang langka dan sangat dibutuhkan. Kenali golongan darah Anda dan bagaimana Anda bisa membantu.",
  },
];

export default function Berita() {
  const [current, setCurrent] = useState(0);
  const visible = 3;
  const max = newsItems.length - visible;

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, max));

  return (
    <section
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
        {/* Prev Button */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-[#7B1818] text-white flex items-center justify-center hover:bg-[#5B0E0E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards */}
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
                style={{
                  width: `calc(${100 / visible}% - ${((visible - 1) * 16) / visible}px)`,
                }}
              >
                <CardBerita
                  judul={item.judul}
                  slug={item.slug}
                  isi={item.isi}
                  gambar_url={item.gambar_url}
                  onClick={(slug) => console.log("Klik:", slug)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
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