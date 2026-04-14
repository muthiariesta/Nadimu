"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCircle, ChevronDown, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EditProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [namaLengkap, setNamaLengkap] = useState("");
  const [nik, setNik] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [riwayatPenyakit, setRiwayatPenyakit] = useState("");
  const [golonganDarah, setGolonganDarah] = useState("");
  const [rhesus, setRhesus] = useState("");

  const [provinsi, setProvinsi] = useState("");
  const [kotaKabupaten, setKotaKabupaten] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kelurahan, setKelurahan] = useState("");

  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profil } = await supabase
        .from("profil")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profil) {
        setNamaLengkap(profil.nama_lengkap || "");
        setNik(profil.nik || "");
        setTanggalLahir(profil.tanggal_lahir || "");
        setJenisKelamin(profil.jenis_kelamin || "");
        setRiwayatPenyakit(profil.riwayat_penyakit || "");
        setProvinsi(profil.provinsi || "");
        setKotaKabupaten(profil.kota || "");
        setKecamatan(profil.kecamatan || "");
        setKelurahan(profil.kelurahan || "");
        setGolonganDarah(profil.golongan_darah || "");
        setRhesus(profil.rhesus || "");
        setFotoUrl(profil.foto_url || null);
      }
    };
    loadInitialData();
  }, []);

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setFotoUrl(publicUrl);
    } catch (error: any) {
      alert("Gagal upload: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimpan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profil")
      .update({
        nama_lengkap: namaLengkap,
        nik: nik,
        tanggal_lahir: tanggalLahir,
        jenis_kelamin: jenisKelamin,
        riwayat_penyakit: riwayatPenyakit,
        provinsi,
        kota: kotaKabupaten,
        kecamatan,
        kelurahan,
        golongan_darah: golonganDarah,
        rhesus,
        foto_url: fotoUrl,
      })
      .eq("id", user.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Profil diperbarui!");
      router.push("/Dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full font-[Plus_Jakarta_Sans] bg-[radial-gradient(ellipse_at_center,#e8c0c0_0%,#f3e4e4_40%,#FCFAEE_100%)] px-10 py-8 box-border relative">
      <button onClick={() => router.back()} className="absolute top-7 left-8 bg-transparent border-none cursor-pointer">
        <ArrowLeft size={32} color="#7D0A0A" />
      </button>

      {/* FOTO PROFIL */}
      <div className="flex flex-col items-center mb-7">
        <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {fotoUrl ? (
            <img src={fotoUrl} alt="Profil" className="w-20 h-20 rounded-full object-cover border-2 border-[#7D0A0A]" />
          ) : (
            <UserCircle size={80} color="#7D0A0A" strokeWidth={1.5} />
          )}
          <div className="absolute bottom-0 right-0 bg-[#7D0A0A] p-1.5 rounded-full border-2 border-[#FCFAEE]">
            <Camera size={14} color="#FCFAEE" />
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUploadFoto} />
        <span className="text-lg font-semibold text-[#7D0A0A] mt-2">
          {loading ? "Mengunggah..." : "Edit Foto"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-5 max-w-[1000px] mx-auto">
        {/* KOLOM KIRI */}
        <div className="bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-[#7D0A0A] pl-2">Nama Lengkap</label>
            <input type="text" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full"/>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-[#7D0A0A] pl-2">NIK</label>
            <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full"/>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-base font-medium text-[#7D0A0A] pl-2">Tanggal Lahir</label>
              <input type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full"/>
            </div>
            <div className="flex-1">
              <label className="text-base font-medium text-[#7D0A0A] pl-2">Jenis Kelamin</label>
              <div className="flex flex-col gap-1 pt-1">
                {["Laki-Laki", "Perempuan"].map((jk) => (
                  <label key={jk} className="flex items-center gap-2 text-sm text-[#7D0A0A] cursor-pointer">
                    <input type="radio" name="jk" value={jk} checked={jenisKelamin === jk} onChange={() => setJenisKelamin(jk)} className="accent-[#7D0A0A]"/> {jk}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-[#7D0A0A] pl-2">Riwayat Penyakit</label>
            <textarea value={riwayatPenyakit} onChange={(e) => setRiwayatPenyakit(e.target.value)} rows={3} className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full resize-none"/>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl p-6 flex flex-col gap-4">
            <label className="text-base font-medium text-[#7D0A0A] pl-2">Alamat Tempat Tinggal</label>
            
            <div className="flex gap-4">
              {[
                { label: "Provinsi", val: provinsi, set: setProvinsi, opt: ["Bali", "Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur"] },
                { label: "Kecamatan", val: kecamatan, set: setKecamatan, opt: ["Bekasi Utara", "Bekasi Timur", "Bekasi Barat", "Bekasi Selatan", "Tambun Selatan"] },
              ].map((item) => (
                <div key={item.label} className="flex-1 flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#7D0A0A] pl-2">{item.label}</label>
                  <div className="relative">
                    <select value={item.val} onChange={(e) => item.set(e.target.value)} className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-2.5 text-sm text-[#7D0A0A] outline-none w-full appearance-none">
                      <option value="">Pilih</option>
                      {item.opt.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={16} color="#7D0A0A" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {[
                { label: "Kota/Kabupaten", val: kotaKabupaten, set: setKotaKabupaten, opt: ["Bandung", "Bekasi", "Bogor", "Depok", "Jakarta"] },
                { label: "Kelurahan", val: kelurahan, set: setKelurahan, opt: ["Aren Jaya", "Harapan Baru", "Kaliabang Tengah", "Marga Mulya", "Perwira"] },
              ].map((item) => (
                <div key={item.label} className="flex-1 flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#7D0A0A] pl-2">{item.label}</label>
                  <div className="relative">
                    <select value={item.val} onChange={(e) => item.set(e.target.value)} className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-2.5 text-sm text-[#7D0A0A] outline-none w-full appearance-none">
                      <option value="">Pilih</option>
                      {item.opt.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={16} color="#7D0A0A" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl p-6 flex gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#7D0A0A]">Golongan Darah</label>
              {["A", "B", "AB", "O"].map(g => (
                <label key={g} className="flex items-center gap-2 text-sm text-[#7D0A0A]">
                  <input type="radio" value={g} checked={golonganDarah === g} onChange={() => setGolonganDarah(g)} className="accent-[#7D0A0A]"/> {g}
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#7D0A0A]">Rhesus</label>
              {["+", "-"].map(r => (
                <label key={r} className="flex items-center gap-2 text-sm text-[#7D0A0A]">
                  <input type="radio" value={r} checked={rhesus === r} onChange={() => setRhesus(r)} className="accent-[#7D0A0A]"/> {r}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button onClick={handleSimpan} className="bg-[#7D0A0A] hover:bg-[#F88E8E] active:scale-95 transition-all text-[#FCFAEE] font-extrabold rounded-2xl px-12 py-3 text-lg">
          SIMPAN
        </button>
      </div>
    </div>
  );
}