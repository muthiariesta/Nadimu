"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Permintaan() {
  const router = useRouter();
  const [namaPasien, setNamaPasien] = useState("");
  const [golonganDarah, setGolonganDarah] = useState("");
  const [rhesus, setRhesus] = useState("");
  const [jumlahKantong, setJumlahKantong] = useState("");
  const [namaRumahSakit, setNamaRumahSakit] = useState("");
  const [daerah, setDaerah] = useState("");
  const [catatanTambahan, setCatatanTambahan] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const handleKirim = async () => {
    // Validasi dasar
    if (!namaPasien || !golonganDarah || !rhesus || !jumlahKantong || !namaRumahSakit || !daerah) {
      alert("Lengkapi semua data!");
      return;
    }
    if (!userId) {
      alert("Kamu belum login!");
      return;
    }

    setLoading(true);

    // FIX LOGIC: Menangkap error insert secara spesifik
    const { data: permintaan, error: insertError } = await supabase
      .from("permintaan_darah")
      .insert({
        pencari_id: userId,
        nama_pasien: namaPasien,
        golongan_darah: golonganDarah,
        rhesus: rhesus,
        jumlah_kantong: parseInt(jumlahKantong),
        rs_pasien: namaRumahSakit,
        kota: daerah,
        catatan: catatanTambahan,
        status: "aktif",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Detail Error Insert:", insertError);
      alert(`Gagal menyimpan permintaan: ${insertError.message}`);
      setLoading(false);
      return;
    }

    // Pastikan data permintaan ada sebelum lanjut
    if (!permintaan) {
      alert("Gagal mendapatkan data respon dari server.");
      setLoading(false);
      return;
    }

    // Ambil data pendonor potensial
    const { data: pendonor, error: pendonorError } = await supabase
      .from("profil")
      .select("id")
      .eq("golongan_darah", golonganDarah)
      .eq("rhesus", rhesus)
      .eq("kota", daerah)
      .eq("aktif_pendonor", true)
      .neq("id", userId);

    if (pendonorError) {
      console.error("Error Fetch Pendonor:", pendonorError);
    }

    // Kirim notifikasi via API Route
    try {
      await fetch("/api/kirim-notif-permintaan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permintaan_id: permintaan.id,
          golongan: `${golonganDarah}${rhesus}`,
          kota: daerah,
          nama_pasien: namaPasien,
          rs: namaRumahSakit,
          pendonor_ids: pendonor?.map((p) => p.id) ?? [],
        }),
      });
    } catch (fetchError) {
      console.error("Error API Notif:", fetchError);
    }

    setLoading(false);
    router.push("/Hasil");
  };

  return (
    <div className="min-h-screen w-full font-[Plus_Jakarta_Sans] bg-[linear-gradient(225deg,#F88E8E_0%,#e8c0c0_20%,#f3e4e4_50%,#FCFAEE_100%)] px-10 py-8">
      <div className="relative flex items-center justify-center mb-8">
        <button onClick={() => router.back()} className="absolute left-0 p-1 hover:opacity-70 transition-opacity">
          <ArrowLeft size={32} color="#7D0A0A" />
        </button>
        <h1 className="text-3xl font-extrabold tracking-[2px] text-[#7D0A0A]">PERMINTAAN</h1>
      </div>

      <div className="flex gap-[80px] max-w-4xl mx-auto">
        <div className="w-72 flex-1 bg-[#F88E8E]/50 rounded-2xl p-6">
          <h2 className="text-[#7D0A0A] font-bold text-base text-center mb-4 leading-snug">
            Panduan Permintaan<br />Kantong Darah
          </h2>
          <ol className="text-[#7D0A0A] text-sm space-y-3 list-decimal list-outside pl-4">
            <li>Isi formulir sesuai dengan data pasien yang dibutuhkan.</li>
            <li>Setelah semua data terisi dengan benar, klik Kirim.</li>
            <li>Sistem akan memproses data dan mencocokkan kebutuhan darah dengan stok darah di fasilitas kesehatan terdekat atau dengan pendonor yang memiliki golongan darah yang sesuai.</li>
            <li>Jika ditemukan stok darah atau pendonor yang sesuai, Anda dapat langsung menghubungi kontak yang tersedia untuk mendapatkan kantong darah.</li>
          </ol>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#7D0A0A] pl-2">Nama Pasien</label>
            <input
              type="text"
              value={namaPasien}
              onChange={(e) => setNamaPasien(e.target.value)}
              className="bg-[#F88E8E]/50 border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full placeholder-[#c0a0a0]"
            />
          </div>

          <div className="flex gap-8 items-start">
            <div className="flex flex-col gap-2 pl-2">
              <label className="text-sm text-[#7D0A0A]">Golongan Darah</label>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {["A", "B", "AB", "O"].map((gol) => (
                  <label key={gol} className="flex items-center gap-2 text-sm text-[#7D0A0A] cursor-pointer">
                    <input
                      type="radio"
                      name="golonganDarah"
                      value={gol}
                      checked={golonganDarah === gol}
                      onChange={() => setGolonganDarah(gol)}
                      className="accent-[#7D0A0A] w-4 h-4 cursor-pointer"
                    />
                    {gol}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#7D0A0A]">Rhesus</label>
              <div className="flex flex-col gap-2">
                {["+", "-"].map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm text-[#7D0A0A] cursor-pointer">
                    <input
                      type="radio"
                      name="rhesus"
                      value={r}
                      checked={rhesus === r}
                      onChange={() => setRhesus(r)}
                      className="accent-[#7D0A0A] w-4 h-4 cursor-pointer"
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#7D0A0A] pl-2">Jumlah Kantong Darah</label>
            <input
              type="number"
              min={1}
              value={jumlahKantong}
              onChange={(e) => setJumlahKantong(e.target.value)}
              className="bg-[#F88E8E]/50 border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full placeholder-[#c0a0a0]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#7D0A0A] pl-2">Nama Rumah Sakit</label>
            <input
              type="text"
              value={namaRumahSakit}
              onChange={(e) => setNamaRumahSakit(e.target.value)}
              className="bg-[#F88E8E]/50 border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full placeholder-[#c0a0a0]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#7D0A0A] pl-2">Daerah</label>
            <div className="relative">
              <select
                value={daerah}
                onChange={(e) => setDaerah(e.target.value)}
                className="bg-[#F88E8E]/50 border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full appearance-none cursor-pointer"
              >
                <option value=""></option>
                <option>Bandung</option>
                <option>Bekasi</option>
                <option>Jakarta</option>
                <option>Surabaya</option>
                <option>Medan</option>
                <option>Yogyakarta</option>
                <option>Semarang</option>
                <option>Makassar</option>
              </select>
              <ChevronDown size={25} color="#7D0A0A" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#7D0A0A] pl-2">Catatan Tambahan</label>
            <input
              type="text"
              value={catatanTambahan}
              onChange={(e) => setCatatanTambahan(e.target.value)}
              className="bg-[#F88E8E]/50 border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full placeholder-[#c0a0a0]"
            />
          </div>

          <button
            onClick={handleKirim}
            disabled={loading}
            className="w-full bg-[#7D0A0A] hover:bg-[#F88E8E] active:scale-95 transition-all duration-200 text-[#FCFAEE] font-extrabold tracking-[2px] rounded-2xl py-2 text-xl mt-1 disabled:opacity-60"
          >
            {loading ? "MEMPROSES..." : "KIRIM"}
          </button>
        </div>
      </div>
    </div>
  );
}