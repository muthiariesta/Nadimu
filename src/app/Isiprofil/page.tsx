"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft, CircleUser, UserCircle, ChevronDown} from "lucide-react";

export default function EditProfile() {
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
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => history.back()}>
        <ArrowLeft size ={32} color="#7D0A0A"/>
      </button>

      <div style={styles.avatarWrap}>
        <UserCircle size={80} color="#7D0A0A" strokeWidth={1.5}/>
        <span style={styles.editFotoLabel}>Edit Foto</span>
      </div>

      <div style={styles.formGrid}>

        <div style={styles.card}>
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Nama Lengkap</label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              style={styles.inputBox}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>NIK</label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              style={styles.inputBox}
            />
          </div>

          <div style={styles.rowGroup}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.fieldLabel}>Tanggal Lahir</label>
              <div style={styles.selectWrap}>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  style={styles.selectBox}
                />
              </div>
            </div>

            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.fieldLabel}>Jenis Kelamin</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value="Laki-Laki"
                    checked={jenisKelamin === "Laki-Laki"}
                    onChange={() => setJenisKelamin("Laki-Laki")}
                    style={styles.radioInput}
                  />
                  Laki-Laki
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value="Perempuan"
                    checked={jenisKelamin === "Perempuan"}
                    onChange={() => setJenisKelamin("Perempuan")}
                    style={styles.radioInput}
                  />
                  Perempuan
                </label>
              </div>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Riwayat Penyakit</label>
            <textarea
              value={riwayatPenyakit}
              onChange={(e) => setRiwayatPenyakit(e.target.value)}
              style={styles.textareaBox}
              rows={3}
            />
          </div>
        </div>

        <div style={styles.rightCol}>

          <div style={styles.card}>
            <label style={{ ...styles.fieldLabel, marginBottom: "4px", fontSize: "14px" }}>
              Alamat Tempat Tinggal
            </label>

            <div style={styles.rowGroup}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.fieldLabel}>Provinsi</label>
                <div style={styles.selectWrap}>
                  <select
                    value={provinsi}
                    onChange={(e) => setProvinsi(e.target.value)}
                    style={styles.selectBox}>
                    <option value=""></option>
                    <option>Jawa Barat</option>
                    <option>Jawa Tengah</option>
                    <option>Jawa Timur</option>
                    <option>DKI Jakarta</option>
                    <option>Banten</option>
                    <option>Bali</option>
                  </select>
                  <ChevronDown size={25} color="#7D0A0A" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}/>
                </div>
              </div>

              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.fieldLabel}>Kecamatan</label>
                <div style={styles.selectWrap}>
                  <select
                    value={kecamatan}
                    onChange={(e) => setKecamatan(e.target.value)}
                    style={styles.selectBox}>
                    <option value=""></option>
                    <option>Kecamatan 1</option>
                    <option>Kecamatan 2</option>
                  </select>
                  <ChevronDown size={25} color="#7D0A0A" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}/>
                </div>
              </div>
            </div>

            <div style={styles.rowGroup}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.fieldLabel}>Kota/Kabupaten</label>
                <div style={styles.selectWrap}>
                  <select
                    value={kotaKabupaten}
                    onChange={(e) => setKotaKabupaten(e.target.value)}
                    style={styles.selectBox}>
                    <option value=""></option>
                    <option>Bandung</option>
                    <option>Bekasi</option>
                    <option>Bogor</option>
                    <option>Depok</option>
                  </select>
                  <ChevronDown size={25} color="#7D0A0A" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}/>
                </div>
              </div>

              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.fieldLabel}>Kelurahan</label>
                <div style={styles.selectWrap}>
                  <select
                    value={kelurahan}
                    onChange={(e) => setKelurahan(e.target.value)}
                    style={styles.selectBox}>
                    <option value=""></option>
                    <option>Kelurahan 1</option>
                    <option>Kelurahan 2</option>
                  </select>
                  <ChevronDown size={25} color="#7D0A0A" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}/>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.rowGroup}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={{ ...styles.fieldLabel, marginBottom: "8px" }}>Golongan Darah</label>
                {["A", "B", "AB", "O"].map((gol) => (
                  <label key={gol} style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="golonganDarah"
                      value={gol}
                      checked={golonganDarah === gol}
                      onChange={() => setGolonganDarah(gol)}
                      style={styles.radioInput}
                    />
                    {gol}
                  </label>
                ))}
              </div>

              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={{ ...styles.fieldLabel, marginBottom: "8px" }}>Rhesus</label>
                {["+", "-"].map((r) => (
                  <label key={r} style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="rhesus"
                      value={r}
                      checked={rhesus === r}
                      onChange={() => setRhesus(r)}
                      style={styles.radioInput}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
        <button style={styles.btnSimpan}>SIMPAN</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #FCFAEE 0%, #f3e4e4 40%, #e8c0c0 70%, #7D0A0A 100%)",
    padding: "2rem 2.5rem 3rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxSizing: "border-box",
    position: "relative",
  },

  backBtn: {
    position: "absolute",
    top: "1.8rem",
    left: "2rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },

  avatarWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.8rem",
  },

  editFotoLabel: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#7D0A0A",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },

  card: {
    background: "rgba(232, 197, 190, 0.55)",
    border: "1px solid rgba(125,10,10,0.15)",
    borderRadius: "16px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  fieldLabel: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#7D0A0A",
    paddingLeft: "8px",
  },

  inputBox: {
    background: "#FCFAEE",
    border: "none",
    borderRadius: "15px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#7D0A0A",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },

  textareaBox: {
    background: "#FCFAEE",
    border: "none",
    borderRadius: "15px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#7D0A0A",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    resize: "none",
  },

  selectWrap: {
    position: "relative",
    width: "100%",
  },

  selectBox: {
    background: "#FCFAEE",
    border: "none",
    borderRadius: "15px",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#7D0A0A",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    appearance: "none",
    cursor: "pointer",
  },

  rowGroup: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },

  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    paddingTop: "1px",
  },

  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#7D0A0A",
    cursor: "pointer",
  },

  radioInput: {
    accentColor: "#7D0A0A",
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },

  btnSimpan: {
    background: "#7D0A0A",
    color: "#FCFAEE",
    border: "none",
    borderRadius: "15px",
    padding: "13px 48px",
    fontSize: "18px",
    fontWeight: 800,
    letterSpacing: "2px",
    cursor: "pointer",
    fontFamily: "Plus Jakarta Sans, sans serif",
  },
};
