"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const INDONESIA_BOUNDS: L.LatLngBoundsExpression = [
  [-11.0, 94.0],
  [6.0, 141.0],
];

const WILAYAH_COORDS: Record<string, [number, number]> = {
  "DKI Jakarta": [-6.2088, 106.8456],
  "Jawa Barat": [-6.9175, 107.6191],
  "Jawa Tengah": [-7.0051, 110.4381],
  "Jawa Timur": [-7.2575, 112.7521],
  "Sumatera Utara": [3.5952, 98.6722],
  "Sumatera Selatan": [-2.9761, 104.7754],
  "Kalimantan Selatan": [-3.3167, 114.59],
  "Kalimantan Timur": [-0.5022, 117.1536],
  "Sulawesi Selatan": [-5.1476, 119.4146],
  "Bali": [-8.4095, 115.1889],
  "Papua": [-2.5916, 140.669],
};

export default function MapPetaStok({ data }: { data: any[] }) {
  return (
    <div className="relative w-full h-full font-['Plus_Jakarta_Sans']"> 
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        minZoom={5}
        maxBounds={INDONESIA_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%", background: "#1a1a1a" }}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          className="map-maroon-filter"
        />

        {data.map((w) => {
          const coords = WILAYAH_COORDS[w.wilayah];
          if (!coords) return null;

          const totalAda = w.units.reduce((a: number, u: any) => a + u.ada, 0);
          const totalKap = w.units.reduce((a: number, u: any) => a + u.kap, 0);
          const ratio = totalAda / totalKap;

          const statusColor = ratio < 0.25 ? "#EF4444" : ratio < 0.5 ? "#EAB308" : "#22C55E";
          const size = 36;

          const customIcon = L.divIcon({
            className: "custom-marker-icon",
            html: `
              <div class="marker-container">
                <div class="pulse-ring" style="border-color: ${statusColor}"></div>
                <div class="marker-circle" style="border-color: ${statusColor}">
                  <span class="marker-value">${totalAda}</span>
                </div>
                <span class="marker-label">${w.wilayah.split(' ')[0]}</span>
              </div>
            `,
            iconSize: [60, 60],
            iconAnchor: [30, 30],
          });

          return (
            <Marker key={w.wilayah} position={coords} icon={customIcon}>
              <Tooltip direction="top" offset={[0, -20]} opacity={1} className="nadimu-tooltip">
                <div className="p-1">
                  <p className="font-black text-[#7D0A0A] text-[11px] leading-tight uppercase">{w.wilayah}</p>
                  <p className="text-[10px] text-gray-600 font-bold">Total: {totalAda} Kantong</p>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .map-maroon-filter {
          filter: brightness(0.6) invert(1) grayscale(1) sepia(1) saturate(10) hue-rotate(-50deg) brightness(0.4) contrast(1.2) !important;
        }

        .leaflet-container {
          background: #121212 !important;
        }

        .marker-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .marker-circle {
          width: 32px;
          height: 32px;
          background: rgba(0, 0, 0, 0.85);
          border: 2px solid;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }

        .marker-value {
          color: white;
          font-size: 11px;
          font-weight: 900;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .marker-label {
          color: white;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          margin-top: 4px;
          letter-spacing: 0.5px;
          text-shadow: 2px 2px 4px rgba(0,0,0,1);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .pulse-ring {
          position: absolute;
          width: 32px;
          height: 32px;
          border: 2px solid;
          border-radius: 50%;
          animation: map-pulse 2s infinite;
          z-index: 1;
        }

        @keyframes map-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .nadimu-tooltip {
          background: #FCFAEE !important;
          border: 2px solid #7D0A0A !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        
        .leaflet-tooltip-top:before {
          border-top-color: #7D0A0A !important;
        }
      `}</style>
    </div>
  );
}