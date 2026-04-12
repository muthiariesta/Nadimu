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

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 bg-[linear-gradient(to_right,#d4918a_10%,#C5928B_80%,#7D0A0A_100%)]">
        <div className="flex flex-col items-center gap-2 mb-7">
          <img
            src="/asset/logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain relative z-10"/>
          <span className="text-3xl font-extrabold tracking-widest text-[#7D0A0A]">
            DAFTAR
          </span>
        </div>

        <div className="bg-[#e8c5be] rounded-4xl p-8 w-full max-w-[340px] flex flex-col gap-4 border border-[#7D0A0A]">

          <div className="flex flex-col gap-1">
            <label htmlFor="emailInput" className="text-lg font-semibold text-[#7D0A0A] pl-2">
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
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#7D0A0A]"/>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="pwInput" className="text-lg font-semibold text-[#7D0A0A] pl-2">
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
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#7D0A0A] [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"/>
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
            className="bg-[#7D0A0A]/80 hover:bg-[#F88E8E] active:scale-95 transition-all duration-200 text-white rounded-full py-3 text-md font-semibold tracking-[1.5px] cursor-pointer mt-1">
            KONFIRMASI
          </button>

          <div className="text-center text-sm text-[#7D0A0A] mt-1">
            Sudah Memiliki Akun?{" "}
            <a href="/Login" className="text-[#7D0A0A] font-bold cursor-pointer no-underline hover:underline">
              MASUK
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
