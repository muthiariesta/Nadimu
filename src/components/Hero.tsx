"use client";
import { useEffect, useRef } from "react";

const stats = [
  { value: "10000", label: "Pendonor Aktif" },
  { value: "3500", label: "Nyawa Terselamatkan" },
  { value: "2000", label: "Mitra Kesehatan" },
  { value: "400", label: "Event Donor" },
];

export default function Hero() {
  const countersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll("[data-target]");
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute("data-target") || "0");
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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 30%, #C8726A 0%, #D4918A 25%, #E8B4AE 50%, #F2D5CF 70%, #F8EDE8 90%, #FAF0EB 100%)",
        }}
      />

      {/* Decorative blob */}
      <div
        className="absolute top-16 right-16 w-72 h-72 rounded-full -z-10 opacity-20"
        style={{
          background: "radial-gradient(circle, #8B1A1A 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div className="px-8 md:px-16 lg:px-24 pt-5 pb-16 ">
        {/* Headline */}
        <div className="max-w-3xl animate-fade-in-up">
          <h1
            className="font-extrabold text-[#8B1A1A] leading-tight mb-6"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
          >
            Setiap Tetes Darahmu Menyelamatkan 
            <br />
            yang Membutuhkan
          </h1>
          <p className="text-[#8B1A1A] text-lg md:text-xl opacity-80 mb-10 max-w-xl leading-relaxed">
            Platform yang menghubungkan pendonor dan pencari darah secara real-time
            dan terintegrasi di seluruh Indonesia
          </p>
          <button className="bg-[#8B1A1A] text-white font-bold tracking-widest px-10 py-4 rounded-full hover:bg-[#6B1010] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#8B1A1A]/30">
            DONOR SEKARANG
          </button>
        </div>

        {/* Stats Card */}
        <div
          ref={countersRef}
          className="mt-10 mx-auto bg-[#F4BABA]/50 backdrop-blur-sm rounded-3xl px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#8B1A1A]/20"
          style={{ maxWidth: "900px" }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i < stats.length - 1
                  ? "md:border-r md:border-[#8B1A1A]/20"
                  : ""
              }`}
            >
              <div
                className="font-extrabold text-[#8B1A1A] mb-1"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
              >
                <span data-target={stat.value}>0</span>
              </div>
              <p className="text-[#8B1A1A] opacity-70 font-medium text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
