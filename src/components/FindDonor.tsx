export default function FindDonor() {
  return (
    <section className="relative py-32 flex items-center justify-center overflow-hidden">
      {/* Soft cream background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, #F5DDD8 0%, #FAF0EB 60%, #FAF0EB 100%)",
        }}
      />
      {/* Large circle decoration */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle, #D4918A 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="text-center px-8 max-w-3xl mx-auto">
        <h2
          className="font-extrabold text-[#8B1A1A] tracking-wider mb-6 uppercase"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
        >
          Temukan Pendonor Lebih Cepat
        </h2>
        <p className="text-[#8B1A1A] opacity-70 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Kami membantu menghubungkan pendonor darah dengan orang yang
          membutuhkan agar proses pencarian donor dapat dilakukan dengan lebih
          mudah dan cepat.
        </p>
        <button className="bg-[#8B1A1A] text-white font-bold tracking-widest px-12 py-4 rounded-full hover:bg-[#6B1010] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#8B1A1A]/30">
          CARI DONOR
        </button>
      </div>
    </section>
  );
}
