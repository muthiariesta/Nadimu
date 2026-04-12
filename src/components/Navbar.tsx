"use client";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between bg-[#F88E90]/60 backdrop-blur-md shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M18 4C18 4 8 14 8 21.5C8 27.299 12.701 32 18 32C23.299 32 28 27.299 28 21.5C28 14 18 4Z"
            fill="#8B1A1A"
          />
          <path
            d="M18 10C18 10 12 17 12 21.5C12 24.538 14.686 27 18 27C21.314 27 24 24.538 24 21.5C24 17 18 10Z"
            fill="#F4A0A0"
            opacity="0.6"
          />
          <path
            d="M15 22C15 22 16 19 18 18C20 17 21.5 19 21.5 21C21.5 23 20 24.5 18 24.5"
            stroke="#8B1A1A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[#8B1A1A] font-bold text-xl tracking-wide">Nadimu</span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {["Beranda", "Layanan", "Kegiatan", "Berita", "Persebaran"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-[#8B1A1A] font-medium hover:opacity-70 transition-opacity"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Masuk Button */}
      <button className="hidden md:block bg-[#8B1A1A] text-white font-bold tracking-widest px-8 py-3 rounded-full hover:bg-[#6B1010] transition-colors">
        MASUK
      </button>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-[#8B1A1A]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#f5e8e8] shadow-lg p-6 flex flex-col gap-4 md:hidden">
          {["Beranda", "Layanan", "Kegiatan", "Berita", "Persebaran"].map((item) => (
            <a key={item} href="#" className="text-[#8B1A1A] font-medium text-lg">
              {item}
            </a>
          ))}
          <button className="bg-[#8B1A1A] text-white font-bold tracking-widest px-8 py-3 rounded-full mt-2">
            MASUK
          </button>
        </div>
      )}
    </nav>
  );
}
