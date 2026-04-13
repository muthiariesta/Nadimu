"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface RegionData {
  nama: string;
  cx: number;
  cy: number;
  total: number;
  status: "kritis" | "waspada" | "aman";
}

const REGION_MAP: Record<string, { nama: string; cx: number; cy: number }> = {
  "Sumatera Utara":    { nama: "Sumatera", cx: 98,  cy: 3   },
  "Sumatera Barat":   { nama: "Sumatera", cx: 98,  cy: 3   },
  "Sumatera Selatan": { nama: "Sumatera", cx: 98,  cy: 3   },
  "Riau":             { nama: "Sumatera", cx: 98,  cy: 3   },
  "Lampung":          { nama: "Sumatera", cx: 98,  cy: 3   },
  "Aceh":             { nama: "Sumatera", cx: 98,  cy: 3   },
  "DKI Jakarta":      { nama: "Jawa",     cx: 107, cy: -7  },
  "Jawa Barat":       { nama: "Jawa",     cx: 107, cy: -7  },
  "Jawa Tengah":      { nama: "Jawa",     cx: 107, cy: -7  },
  "Jawa Timur":       { nama: "Jawa",     cx: 107, cy: -7  },
  "DI Yogyakarta":    { nama: "Jawa",     cx: 107, cy: -7  },
  "Banten":           { nama: "Jawa",     cx: 107, cy: -7  },
  "Bali":             { nama: "Bali & NTB", cx: 115.5, cy: -8.5 },
  "Nusa Tenggara Barat": { nama: "Bali & NTB", cx: 115.5, cy: -8.5 },
  "Nusa Tenggara Timur": { nama: "NTT",   cx: 121, cy: -9.5 },
  "Kalimantan Barat": { nama: "Kalimantan", cx: 113, cy: 0.5 },
  "Kalimantan Tengah":{ nama: "Kalimantan", cx: 113, cy: 0.5 },
  "Kalimantan Selatan":{ nama: "Kalimantan", cx: 113, cy: 0.5 },
  "Kalimantan Timur": { nama: "Kalimantan", cx: 113, cy: 0.5 },
  "Kalimantan Utara": { nama: "Kalimantan", cx: 113, cy: 0.5 },
  "Sulawesi Utara":   { nama: "Sulawesi", cx: 122, cy: -2  },
  "Sulawesi Tengah":  { nama: "Sulawesi", cx: 122, cy: -2  },
  "Sulawesi Selatan": { nama: "Sulawesi", cx: 122, cy: -2  },
  "Sulawesi Tenggara":{ nama: "Sulawesi", cx: 122, cy: -2  },
  "Gorontalo":        { nama: "Sulawesi", cx: 122, cy: -2  },
  "Maluku":           { nama: "Maluku",   cx: 128, cy: -3.5 },
  "Maluku Utara":     { nama: "Maluku",   cx: 128, cy: -3.5 },
  "Papua":            { nama: "Papua",    cx: 137, cy: -4.5 },
  "Papua Barat":      { nama: "Papua",    cx: 137, cy: -4.5 },
};

function getStatus(jumlah: number, kapasitas: number): "kritis" | "waspada" | "aman" {
  const r = jumlah / kapasitas;
  if (r < 0.25) return "kritis";
  if (r < 0.5) return "waspada";
  return "aman";
}

function getColor(s: string) {
  return { kritis: "#BF3131", waspada: "#F2E076", aman: "rgba(127,183,60,0.53)" }[s] ?? "#7D0A0A";
}

function getTextColor(s: string) {
  return s === "waspada" ? "#854D0E" : s === "aman" ? "#166534" : "#991B1B";
}

export default function PetaD3() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; nama: string; total: number; status: string } | null>(null);

  useEffect(() => {
    const fetchStok = async () => {
      const { data } = await supabase
        .from("stok_darah")
        .select("jumlah_kantong, kapasitas, institusi:pmi_id(provinsi)");

      if (!data) return;

      const grouped: Record<string, { total: number; kapTotal: number; nama: string; cx: number; cy: number }> = {};

      data.forEach((item: any) => {
        const provinsi = item.institusi?.provinsi ?? "";
        const mapped = REGION_MAP[provinsi];
        if (!mapped) return;

        const key = mapped.nama;
        if (!grouped[key]) {
          grouped[key] = { total: 0, kapTotal: 0, nama: mapped.nama, cx: mapped.cx, cy: mapped.cy };
        }
        grouped[key].total += item.jumlah_kantong ?? 0;
        grouped[key].kapTotal += item.kapasitas ?? 100;
      });

      const result: RegionData[] = Object.values(grouped).map((r) => ({
        nama: r.nama,
        cx: r.cx,
        cy: r.cy,
        total: r.total,
        status: getStatus(r.total, r.kapTotal),
      }));

      setRegions(result);
    };

    fetchStok();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    let d3Module: typeof import("d3");
    let topoModule: typeof import("topojson-client");

    const init = async () => {
      const [d3, topojson] = await Promise.all([
        import("d3"),
        import("topojson-client"),
      ]);
      d3Module = d3;
      topoModule = topojson;

      const container = containerRef.current!;
      const W = container.clientWidth;
      const H = container.clientHeight;

      const svg = d3.select(svgRef.current!);
      svg.selectAll("*").remove();
      svg.attr("width", W).attr("height", H);

      try {
        const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json");
        const world = await res.json();
        const countries = topojson.feature(world, world.objects.countries as any) as any;
        const indo = countries.features.find((f: any) => +f.id === 360);
        if (!indo) return;

        const proj = d3.geoMercator().fitExtent([[40, 40], [W - 40, H - 40]], indo);
        const path = d3.geoPath().projection(proj);

        const g = svg.append("g");

        const zoom = d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.5, 8])
          .on("zoom", (e) => g.attr("transform", e.transform));

        svg.call(zoom as any);

        g.append("path")
          .datum(indo)
          .attr("d", path as any)
          .attr("fill", "#7D0A0A")
          .attr("stroke", "#5A0808")
          .attr("stroke-width", 0.5);

        regions.forEach((region) => {
          const [x, y] = proj([region.cx, region.cy]) ?? [0, 0];
          const c = getColor(region.status);

          const mg = g.append("g")
            .attr("transform", `translate(${x},${y})`)
            .style("cursor", "pointer");

          mg.append("circle").attr("r", 22).attr("fill", c).attr("opacity", 0.2);
          mg.append("circle").attr("r", 16).attr("fill", c).attr("stroke", "white").attr("stroke-width", 1.5);

          mg.append("text")
            .attr("text-anchor", "middle").attr("y", -2)
            .style("font-size", "7px").style("font-weight", "700")
            .style("fill", "#3D0A0A").style("pointer-events", "none")
            .text(region.nama.toUpperCase());

          mg.append("text")
            .attr("text-anchor", "middle").attr("y", 8)
            .style("font-size", "10px").style("font-weight", "800")
            .style("fill", "#3D0A0A").style("pointer-events", "none")
            .text(region.total);

          mg.on("mousemove", (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            setTooltip({
              x: e.clientX - rect.left + 15,
              y: e.clientY - rect.top - 10,
              nama: region.nama,
              total: region.total,
              status: region.status,
            });
          }).on("mouseleave", () => setTooltip(null));
        });

        (window as any).__petaZoomIn = () => svg.transition().call((zoom as any).scaleBy, 1.5);
        (window as any).__petaZoomOut = () => svg.transition().call((zoom as any).scaleBy, 0.7);
        (window as any).__petaReset = () => svg.transition().call((zoom as any).transform, d3.zoomIdentity);

      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, [regions]);

  return (
    <div className="px-6 md:px-32 mb-3">
      <div
        ref={containerRef}
        className="w-full rounded-3xl overflow-hidden relative border-[1.5px] border-[#E0C5BC] shadow-[0_4px_24px_rgba(125,10,10,0.08)]"
        style={{ height: "clamp(220px, 42vw, 480px)" }}
      >

        <div className="absolute bottom-10 left-4 z-10 flex gap-3">
          {[["#BF3131", "Kritis"], ["#F2E076", "Waspada"], ["rgba(127,183,60,0.53)", "Aman"]].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5 text-[10px] font-bold text-[#7D0A0A]">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              {l}
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 right-4 z-10 flex flex-col gap-1.5">
          {[
            { label: "+", fn: "__petaZoomIn" },
            { label: "−", fn: "__petaZoomOut" },
            { label: "⌂", fn: "__petaReset" },
          ].map((btn) => (
            <button
              key={btn.fn}
              onClick={() => (window as any)[btn.fn]?.()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#7D0A0A]/10 border border-[#7D0A0A]/20 text-[#7D0A0A] hover:bg-[#F88E8E] hover:text-white transition-all text-sm font-bold"
            >
              {btn.label}
            </button>
          ))}
        </div>

        <svg ref={svgRef} className="w-full h-full block" style={{ cursor: "grab" }} />

        {tooltip && (
          <div
            className="absolute pointer-events-none z-50 min-w-[140px] p-3 rounded-xl bg-[#FCFAEE]/95 border border-[#E0C5BC] shadow-xl"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <div className="text-xs font-bold text-[#7D0A0A] mb-0.5">{tooltip.nama}</div>
            <div className="text-[11px] text-[#9A6060] mb-2">{tooltip.total} kantong tersedia</div>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ backgroundColor: getColor(tooltip.status), color: getTextColor(tooltip.status) }}
            >
              {tooltip.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <p className="text-right text-[10px] mt-2 italic text-[#9A6060]">
        *Data Stok Darah Diperbarui Secara Berkala
      </p>
    </div>
  );
}