"use client";

export default function MapHero() {
  return (
    <div className="px-6 md:px-32 mb-3">
      <div
        className="w-full rounded-3xl overflow-hidden relative border-[1.5px] border-[#E0C5BC] shadow-[0_4px_24px_rgba(125,10,10,0.08)]"
        style={{ paddingBottom: "clamp(220px, 42%, 480px)", height: 0 }}
      >
        <iframe
          src="/peta.html"
          className="absolute top-0 left-0 w-full h-full border-none"
          title="Peta Stok Darah Indonesia"
        />
      </div>
      <p className="text-right text-[10px] mt-2 italic text-[#9A6060]">
        *Data Stok Darah Diperbarui Secara Berkala
      </p>
    </div>
  );
}