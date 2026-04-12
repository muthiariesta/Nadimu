const regions = [
  { name: "SUMATERA", kantong: 10, x: "14%", y: "52%", labelX: "2%", labelY: "72%", lineEndX: "14%", lineEndY: "52%" },
  { name: "JAWA", kantong: 25, x: "30%", y: "70%", labelX: "20%", labelY: "84%", lineEndX: "30%", lineEndY: "70%" },
  { name: "BALI", kantong: 25, x: "40%", y: "76%", labelX: "32%", labelY: "90%", lineEndX: "40%", lineEndY: "76%" },
  { name: "KALIMANTAN", kantong: 10, x: "42%", y: "36%", labelX: "35%", labelY: "16%", lineEndX: "42%", lineEndY: "36%" },
  { name: "SULAWESI", kantong: 15, x: "60%", y: "38%", labelX: "55%", labelY: "18%", lineEndX: "60%", lineEndY: "38%" },
  { name: "NTT", kantong: 15, x: "57%", y: "72%", labelX: "57%", labelY: "84%", lineEndX: "57%", lineEndY: "72%" },
  { name: "PAPUA", kantong: 10, x: "84%", y: "50%", labelX: "77%", labelY: "30%", lineEndX: "84%", lineEndY: "50%" },
];

export default function BloodMap() {
  return (
    <section className="py-20 px-8 md:px-16" style={{ background: "linear-gradient(135deg, #FAF0EA 0%, #F5E0DA 100%)" }}>
      <h2 className="text-center font-bold text-[#7B1818] mb-16" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}>
        Pantau Ketersediaan Stok Darah Di Seluruh Indonesia
      </h2>

      <div className="relative max-w-5xl mx-auto" style={{ height: "500px" }}>
        {/* Indonesia SVG Map */}
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
          {/* Maluku & Nusa Tenggara */}
          <ellipse cx="575" cy="210" rx="14" ry="10" fill="#8B1A1A" opacity="0.8" />
          <ellipse cx="600" cy="225" rx="10" ry="8" fill="#8B1A1A" opacity="0.8" />
          <ellipse cx="480" cy="270" rx="22" ry="10" fill="#8B1A1A" />
          <ellipse cx="520" cy="278" rx="18" ry="9" fill="#8B1A1A" />
          <ellipse cx="555" cy="272" rx="14" ry="8" fill="#8B1A1A" />
          {/* Papua */}
          <path d="M650,110 Q690,95 730,100 Q768,106 790,128 Q810,150 808,178 Q805,205 785,222 Q762,238 735,240 Q705,242 680,228 Q654,213 643,188 Q633,162 638,138 Q643,118 650,110Z" fill="#8B1A1A" />
          <path d="M790,140 Q812,135 830,148 Q845,162 840,180 Q834,197 818,202 Q802,207 793,194 Q784,180 787,162 Q789,148 790,140Z" fill="#8B1A1A" />

          {/* Dots & Lines for labels */}
          {regions.map((r) => (
            <g key={r.name}>
              <line x1={`${parseFloat(r.x) * 9}px`} y1={`${parseFloat(r.y) * 4}px`} x2={`${parseFloat(r.labelX) * 9 + 40}px`} y2={`${parseFloat(r.labelY) * 4 + 12}px`} stroke="#7B1818" strokeWidth="1" />
              <circle cx={`${parseFloat(r.x) * 9}px`} cy={`${parseFloat(r.y) * 4}px`} r="5" fill="white" stroke="#7B1818" strokeWidth="2" />
            </g>
          ))}
        </svg>

        {/* Region Labels */}
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

        {/* Footer note */}
        <p className="absolute bottom-0 right-0 text-[#7B1818] opacity-50 text-xs italic">
          *Data Stok Darah Diperbarui Secara Berkala
        </p>
      </div>
    </section>
  );
}
