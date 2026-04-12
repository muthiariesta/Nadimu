"use client";

import { useState } from "react";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

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
    <div className="flex w-screen h-screen overflow-hidden font-[Plus_Jakarta_Sans]">
      <div className="flex-1 relative overflow-hidden">
        <img
          src="/asset/loginpage.png"
          alt="Donor Darah"
          className="w-full h-full object-cover object-center block brightness-95"/>
        <div className="absolute top-0 right-0 w-[300px] h-full pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0)_0%,#d4918a_100%)]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 bg-[linear-gradient(170deg,#d4918a_0%,#d4918a_5%,#c07870_40%,#b06060_100%)]">
        <div className="flex flex-col items-center gap-2 mb-7">
          <img
            src="/asset/logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain relative z-10"/>
          <span className="text-xl font-extrabold tracking-widest text-[#7D0A0A]">
            MASUK
          </span>
        </div>

        <div className="bg-[#e8c5be] rounded-2xl p-8 w-full max-w-[340px] flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label htmlFor="emailInput" className="text-lg font-semibold text-[#7a3030] pl-2">
              Email
            </label>
            <div className="flex items-center gap-2 bg-[#FCFAEE] rounded-full px-4 py-3 border border-[rgba(140,60,60,0.12)]">
              <Mail size={22} color="#7D0A0A" />
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#3a1010] font-[inherit]"/>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="pwInput" className="text-lg font-semibold text-[#7a3030] pl-2">
              Password
            </label>
            <div className="flex items-center gap-2 bg-[#FCFAEE] rounded-full px-4 py-3 border border-[rgba(140,60,60,0.12)]">
              <LockKeyhole size={22} color="#7D0A0A" />
              <input
                id="pwInput"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#3a1010] font-[inherit]"/>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Tampilkan password"
                className="flex items-center opacity-55 border-none bg-transparent cursor-pointer p-0">
                {showPassword
                  ? <EyeOff size={22} style={{ color: "#7D0A0A" }} />
                  : <Eye size={22} style={{ color: "#7D0A0A" }} />
                }
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="bg-[#7a2020] hover:bg-[#5c1515] active:scale-95 transition-all duration-200 text-white rounded-full py-3 text-lg font-semibold tracking-[2px] cursor-pointer mt-1">
            KONFIRMASI
          </button>

          <div className="text-center text-sm text-[#7D0A0A] mt-1">
            Belum Memiliki Akun?{" "}
            <a href="/register" className="text-[#7D0A0A] font-bold cursor-pointer no-underline hover:underline">
              DAFTAR
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
