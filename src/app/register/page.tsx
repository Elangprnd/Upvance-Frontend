"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthSidebar from "@/components/organism/AuthSidebar";
import { checkPasswordStrength } from "@/lib/passwordUtils";



export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordInfo =
    form.password.length > 0
      ? checkPasswordStrength(form.password)
      : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validasi sisi klien sebelum kirim ke server
    if (!form.full_name.trim()) return finishWithError("Nama lengkap wajib diisi");
    if (!form.email.trim()) return finishWithError("Email wajib diisi");
    if (form.password !== form.confirm_password)
      return finishWithError("Password dan konfirmasi password tidak cocok");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        return finishWithError(json.error || "Terjadi kesalahan");
      }

      // Redirect ke halaman verifikasi OTP dengan email sebagai parameter
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch {
      finishWithError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  function finishWithError(msg: string) {
    setError(msg);
    setIsLoading(false);
  }

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

        {/* Register Form Section */}
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

          {/* Register Card */}
          <div className="w-full max-w-[450px] bg-[#D9D9D9]/80 backdrop-blur-xl rounded-[25px] p-8 md:p-10 shadow-[0px_40px_40px_0px_rgba(0,0,0,0.24),0px_10px_22px_0px_rgba(0,0,0,0.27)] relative z-10 flex flex-col items-center">
            <h2 className="text-[24px] font-bold text-center text-black mb-[30px]">
              Daftarkan Akun Anda
            </h2>

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[301px] flex flex-col gap-[13px]"
              noValidate
            >
              {/* Nama Lengkap */}
              <input
                type="text"
                name="full_name"
                placeholder="Nama Lengkap"
                value={form.full_name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={inputClass}
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={inputClass}
              />

              {/* Password dengan show/hide */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Kata Sandi"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
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

              {/* Password Strength Indicator */}
              {passwordInfo && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${passwordInfo.color}`}
                        style={{
                          width:
                            passwordInfo.strength === "weak"
                              ? "33%"
                              : passwordInfo.strength === "medium"
                              ? "66%"
                              : "100%",
                        }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        passwordInfo.strength === "weak"
                          ? "text-red-500"
                          : passwordInfo.strength === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {passwordInfo.label}
                    </span>
                  </div>
                  {passwordInfo.feedback.length > 0 && (
                    <p className="text-[10px] text-gray-500">
                      Tambahkan: {passwordInfo.feedback.join(", ")}
                    </p>
                  )}
                </div>
              )}

              {/* Konfirmasi Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Konfirmasi Kata Sandi"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={`${inputClass} pr-10 ${
                    form.confirm_password &&
                    form.password !== form.confirm_password
                      ? "border-red-400"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirm_password && form.password !== form.confirm_password && (
                <p className="text-[10px] text-red-500 -mt-1">Password tidak cocok</p>
              )}

              {/* Error / Success Message */}
              {error && (
                <div className="w-full bg-red-50 border border-red-200 rounded-[10px] px-3 py-2">
                  <p className="text-[11px] text-red-600 text-center">{error}</p>
                </div>
              )}
              {success && (
                <div className="w-full bg-green-50 border border-green-200 rounded-[10px] px-3 py-2">
                  <p className="text-[11px] text-green-700 text-center">{success}</p>
                </div>
              )}

              <div className="flex flex-col gap-[13px] mt-2">
                {/* Tombol Daftar */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mendaftar...</span>
                    </>
                  ) : (
                    "Daftar"
                  )}
                </button>

                <div className="flex items-center gap-[17px]">
                  <div className="h-[1px] flex-1 bg-black/10" />
                  <span className="text-[12px] text-black font-normal shrink-0">Atau</span>
                  <div className="h-[1px] flex-1 bg-black/10" />
                </div>

                <Link href="/login" className="block w-full">
                  <button
                    type="button"
                    className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Sudah punya akun? Masuk
                  </button>
                </Link>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
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
