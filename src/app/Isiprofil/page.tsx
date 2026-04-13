"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCircle, ChevronDown } from "lucide-react";

export default function EditProfile() {
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [nik, setNik] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [riwayatPenyakit, setRiwayatPenyakit] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kotaKabupaten, setKotaKabupaten] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [golonganDarah, setGolonganDarah] = useState("");
  const [rhesus, setRhesus] = useState("");

  return (
    <div className="min-h-screen w-full font-[Plus_Jakarta_Sans] bg-[radial-gradient(ellipse_at_center,#e8c0c0_0%,#f3e4e4_40%,#FCFAEE_100%)] px-10 py-8 box-border relative">
      <button
        onClick={() => router.back()}
        className="absolute top-7 left-8 bg-none border-none cursor-pointer p-0 flex items-center bg-transparent">
        <ArrowLeft size={32} color="#7D0A0A" />
      </button>

      <div className="flex flex-col items-center mb-7">
        <UserCircle size={80} color="#7D0A0A" strokeWidth={1.5} />
        <span className="text-lg font-semibold text-[#7D0A0A]">Edit Foto</span>
      </div>

      <div className="grid grid-cols-2 gap-5 max-w-[1000px] mx-auto">

        <div className="bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-[#7D0A0A] pl-2">Nama Lengkap</label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full"/>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-[#7D0A0A] pl-2">NIK</label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full"/>
          </div>

          <div className="flex gap-4 items-start">

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-base font-medium text-[#7D0A0A] pl-2">Tanggal Lahir</label>
              <div className="relative">
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full appearance-none cursor-pointer"/>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-base font-medium text-[#7D0A0A] pl-2">Jenis Kelamin</label>
              <div className="flex flex-col gap-1 pt-1">
                {["Laki-Laki", "Perempuan"].map((jk) => (
                  <label key={jk} className="flex items-center gap-2 text-sm text-[#7D0A0A] cursor-pointer">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value={jk}
                      checked={jenisKelamin === jk}
                      onChange={() => setJenisKelamin(jk)}
                      className="accent-[#7D0A0A] w-4 h-4 cursor-pointer"/>
                    {jk}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-[#7D0A0A] pl-2">Riwayat Penyakit</label>
            <textarea
              value={riwayatPenyakit}
              onChange={(e) => setRiwayatPenyakit(e.target.value)}
              rows={3}
              className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full resize-none"/>
          </div>
        </div>

        <div className="flex flex-col gap-5">

          <div className="bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl p-6 flex flex-col gap-4">
            <label className="text-base font-medium text-[#7D0A0A] pl-2">Alamat Tempat Tinggal</label>

            <div className="flex gap-4">
              {[
                { label: "Provinsi", value: provinsi, setter: setProvinsi, options: ["Jawa Barat", "Jawa Tengah", "Jawa Timur", "DKI Jakarta", "Banten", "Bali"] },
                { label: "Kecamatan", value: kecamatan, setter: setKecamatan, options: ["Kecamatan 1", "Kecamatan 2"] },
              ].map(({ label, value, setter, options }) => (
                <div key={label} className="flex flex-col gap-1 flex-1">
                  <label className="text-base font-medium text-[#7D0A0A] pl-2">{label}</label>
                  <div className="relative">
                    <select
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full appearance-none cursor-pointer">
                      <option value=""></option>
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={18} color="#7D0A0A" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {[
                { label: "Kota/Kabupaten", value: kotaKabupaten, setter: setKotaKabupaten, options: ["Bandung", "Bekasi", "Bogor", "Depok"] },
                { label: "Kelurahan", value: kelurahan, setter: setKelurahan, options: ["Kelurahan 1", "Kelurahan 2"] },
              ].map(({ label, value, setter, options }) => (
                <div key={label} className="flex flex-col gap-1 flex-1">
                  <label className="text-base font-medium text-[#7D0A0A] pl-2">{label}</label>
                  <div className="relative">
                    <select
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="bg-[#FCFAEE] border-none rounded-2xl px-4 py-3 text-sm text-[#7D0A0A] outline-none w-full appearance-none cursor-pointer">
                      <option value=""></option>
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={18} color="#7D0A0A" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F7D4CC] border border-[#7D0A0A] rounded-2xl p-6">
            <div className="flex gap-4">

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-base font-medium text-[#7D0A0A] pl-2">Golongan Darah</label>
                {["A", "B", "AB", "O"].map((gol) => (
                  <label key={gol} className="flex items-center gap-2 text-sm text-[#7D0A0A] cursor-pointer pl-2">
                    <input
                      type="radio"
                      name="golonganDarah"
                      value={gol}
                      checked={golonganDarah === gol}
                      onChange={() => setGolonganDarah(gol)}
                      className="accent-[#7D0A0A] w-4 h-4 cursor-pointer"/>
                    {gol}
                  </label>
                ))}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-base font-medium text-[#7D0A0A] pl-2">Rhesus</label>
                {["+", "-"].map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm text-[#7D0A0A] cursor-pointer pl-2">
                    <input
                      type="radio"
                      name="rhesus"
                      value={r}
                      checked={rhesus === r}
                      onChange={() => setRhesus(r)}
                      className="accent-[#7D0A0A] w-4 h-4 cursor-pointer"/>
                    {r}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button className="bg-[#7D0A0A] hover:bg-[#F88E8E] active:scale-95 transition-all duration-200 text-[#FCFAEE] font-extrabold tracking-[2px] rounded-2xl px-12 py-3 text-lg font-[Plus_Jakarta_Sans]">
          SIMPAN
        </button>
      </div>
    </div>
  );
}
