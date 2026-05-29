"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthSidebar from "@/components/organism/AuthSidebar";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cek apakah ada error dari OAuth callback
  const oauthError = searchParams.get("error");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!form.email.trim()) {
      setError("Email wajib diisi");
      setIsLoading(false);
      return;
    }
    if (!form.password) {
      setError("Password wajib diisi");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        if (res.status === 429) {
          setError(json.error || "Terlalu banyak percobaan. Coba lagi nanti.");
        } else {
          setError(json.error || "Email atau password salah");
        }
        setIsLoading(false);
        return;
      }

      // Login berhasil → redirect ke halaman tujuan
      router.push(nextPath);
      router.refresh(); // Refresh untuk update session di server components
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet kamu.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const inputClass =
    "w-full h-[40px] px-[20px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none text-[12px] text-black placeholder:text-black/50 transition-all";

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] overflow-x-hidden font-['Inter',sans-serif]">
      <div className="flex-1 lg:flex-none w-full lg:max-w-full flex min-h-screen relative overflow-hidden">
        {/* Shared Sidebar */}
        <AuthSidebar />

        {/* Login Form Section */}
        <div className="flex-1 relative flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-white min-h-screen">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/background-auth.png"
              alt="Background"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {/* Decorative Shapes */}
          <div className="absolute top-[5%] right-[2%] w-[15vw] max-w-[200px] aspect-square bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-2xl pointer-events-none z-0" />
          <div className="absolute bottom-[5%] right-[2%] w-[18vw] max-w-[250px] aspect-square bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute top-[8%] left-[10%] w-[18vw] max-w-[300px] aspect-square bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

          {/* Login Card */}
          <div className="w-full max-w-[450px] bg-[#D9D9D9]/80 backdrop-blur-xl rounded-[25px] p-8 md:p-12 shadow-[0px_40px_40px_0px_rgba(0,0,0,0.24),0px_10px_22px_0px_rgba(0,0,0,0.27)] relative z-10 flex flex-col items-center">
            <h2 className="text-[24px] font-bold text-center text-black mb-[32px]">
              Masuk ke Akun Anda
            </h2>

            {/* OAuth Error Banner */}
            {(oauthError || error) && (
              <div className="w-full max-w-[301px] bg-red-50 border border-red-200 rounded-[10px] px-3 py-2 mb-3">
                <p className="text-[11px] text-red-600 text-center">
                  {oauthError === "google_failed"
                    ? "Login dengan Google gagal. Coba lagi."
                    : oauthError === "callback_failed"
                    ? "Verifikasi gagal. Silakan coba login kembali."
                    : error}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[301px] flex flex-col gap-[15px]"
              noValidate
            >
              {/* Email */}
              <input
                type="email"
                name="email"
                id="login-email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="email"
                className={inputClass}
              />

              {/* Password dengan show/hide */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="login-password"
                  placeholder="Kata Sandi"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Lupa Password */}
              <div className="flex justify-end -mt-2">
                <Link href="/forgot-password" className="text-[12px] text-black/70 font-normal hover:underline hover:text-[#2563eb]">
                  Lupa Kata Sandi?
                </Link>
              </div>

              <div className="flex flex-col gap-[13px] mt-2">
                {/* Tombol Masuk */}
                <button
                  type="submit"
                  id="login-submit"
                  disabled={isLoading}
                  className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Masuk...</span>
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>

                <div className="flex items-center gap-[17px]">
                  <div className="h-[1px] flex-1 bg-black/10" />
                  <span className="text-[12px] text-black font-normal shrink-0">Atau</span>
                  <div className="h-[1px] flex-1 bg-black/10" />
                </div>

                <Link href="/register" className="block w-full">
                  <button
                    type="button"
                    className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Belum punya akun? Daftar
                  </button>
                </Link>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="login-google"
                    onClick={handleGoogleLogin}
                    className="h-[40px] flex items-center justify-center gap-[8px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all"
                  >
                    <div className="w-[18px] h-[18px] flex items-center justify-center bg-red-100 rounded-full shrink-0">
                      <span className="text-red-500 font-bold text-[11px]">G</span>
                    </div>
                    <span className="text-[12px] font-normal text-black">Google</span>
                  </button>

                  <button
                    type="button"
                    disabled
                    title="Segera hadir"
                    className="h-[40px] flex items-center justify-center gap-[8px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] opacity-50 cursor-not-allowed"
                  >
                    <div className="w-[18px] h-[18px] flex items-center justify-center bg-black rounded-full shrink-0">
                      <span className="text-white font-bold text-[10px]"></span>
                    </div>
                    <span className="text-[12px] font-normal text-black">Apple</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
