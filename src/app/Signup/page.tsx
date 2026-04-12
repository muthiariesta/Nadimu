"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { useState } from "react";
import { Mail, LockKeyhole, Eye, EyeOff} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Email dan password tidak boleh kosong!");
      return;
    }
    alert("Login berhasil!");
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <img src="/asset/loginpage.png" alt="Donor Darah" style={styles.leftImg} />
        <div style={styles.fadeEdge}></div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.logoWrap}>
            <img src="/asset/logo.png" alt="Logo" style={styles.logoImg} />
          <span style={styles.logoTitle}>DAFTAR</span>
        </div>

        <div style={styles.card}>
          <div style={styles.fieldGroup}>
            <label htmlFor="emailInput" style={styles.fieldLabel}>
              Email
            </label>
            <div style={styles.inputWrap}>
              <Mail size={32} color="#7D0A0A"/>
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="pwInput" style={styles.fieldLabel}>
              Password
            </label>
            <div style={styles.inputWrap}>
              <LockKeyhole size={32} color="#7D0A0A"/>
              <input
                id="pwInput"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Tampilkan password"
                style={styles.eyeBtn}
              >
                {showPassword ? 
                    (<EyeOff size={32} style={{color: "#7D0A0A"}}/>) : 
                    (<Eye size={32} style={{color: "#7D0A0A"}}/>)}
              </button>
            </div>
          </div>

          <button type="button" onClick={handleLogin} style={styles.btnConfirm}>
            KONFIRMASI
          </button>

          <div style={styles.registerRow}>
            Sudah Memiliki Akun?{" "}
            <a href="/register" style={styles.registerLink}>
              MASUK
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },

  leftPanel: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  leftFallback: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(160deg, #c47878 0%, #8b3a3a 55%, #6b2525 100%)",
  },
  leftImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
    filter: "brightness(0.92)",
  },

  fadeEdge: {
  position: "absolute",
  top: 0,
  right: 0,
  width: "300px",
  height: "100%",
  background: "linear-gradient(to right, rgba(255,255,255,0) 0%, #d4918a 100%)",
  pointerEvents: "none",
},

  rightPanel: {
    flex: 1,
    background: "linear-gradient(170deg, #d4918a 0%, #d4918a 5%, #c07870 40%, #b06060 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5rem 2rem",
  },

  logoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "1.8rem",
  },
  logoTitle: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "4px",
    color: "#7D0A0A",
  },
  logoImg: {
  width: "60px",
  height: "60px",
  objectFit: "contain",
  zIndex: 10,
  position: "relative",
},

  card: {
    background: "#e8c5be",
    borderRadius: "20px",
    padding: "2rem 1.75rem 1.75rem",
    width: "100%",
    maxWidth: "340px",
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fieldLabel: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#7a3030",
    paddingLeft: "8px",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f5e8e4",
    borderRadius: "60px",
    padding: "11px 14px",
    border: "1px solid rgba(140,60,60,0.12)",
  },
  input: {
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "14px",
    flex: 1,
    color: "#3a1010",
    fontFamily: "inherit",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    opacity: 0.55,
  },

  btnConfirm: {
    background: "#7a2020",
    color: "white",
    border: "none",
    borderRadius: "60px",
    padding: "14px",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "2px",
    cursor: "pointer",
    marginTop: "0.2rem",
  },

  registerRow: {
    textAlign: "center",
    fontSize: "14px",
    color: "#7D0A0A",
    fontWeight: 450,
    marginTop: "0.1rem",
  },
  registerLink: {
    color: "#7D0A0A",
    fontWeight: 700,
    cursor: "pointer",
  },
};
