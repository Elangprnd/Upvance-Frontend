"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import AuthSidebar from "@/components/organism/AuthSidebar";

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { level: 1, label: "Lemah", color: "bg-red-500" };
    if (score === 2) return { level: 2, label: "Cukup", color: "bg-yellow-500" };
    if (score === 3) return { level: 3, label: "Kuat", color: "bg-blue-500" };
    return { level: 4, label: "Sangat Kuat", color: "bg-green-500" };
  };

  const { level, label, color } = getStrength();
  if (!password) return null;

  return (
    <div className="flex flex-col gap-1 px-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= level ? color : "bg-black/10"
            }`}
          />
        ))}
      </div>
      <p className={`text-[10px] font-semibold ${
        level <= 1 ? "text-red-500" : level === 2 ? "text-yellow-600" : level === 3 ? "text-blue-600" : "text-green-600"
      }`}>{label}</p>
    </div>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inputClass =
    "w-full h-[40px] px-[20px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none text-[12px] text-black placeholder:text-black/50 transition-all";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password) { setError("Password wajib diisi"); return; }
    if (form.password.length < 8) { setError("Password minimal 8 karakter"); return; }
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi tidak cocok");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.password, confirmPassword: form.confirmPassword }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Gagal mengubah password. Coba lagi.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet kamu.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] overflow-x-hidden font-['Inter',sans-serif]">
      <div className="flex-1 lg:flex-none w-full lg:max-w-full flex min-h-screen relative overflow-hidden">
        <AuthSidebar />

        {/* Form Section */}
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

          {/* Card */}
          <div className="w-full max-w-[450px] bg-[#D9D9D9]/80 backdrop-blur-xl rounded-[25px] p-8 md:p-12 shadow-[0px_40px_40px_0px_rgba(0,0,0,0.24),0px_10px_22px_0px_rgba(0,0,0,0.27)] relative z-10 flex flex-col items-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-5">
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-[24px] font-bold text-center text-black mb-2">
              Buat Kata Sandi Baru
            </h2>
            <p className="text-[13px] text-black/60 text-center mb-6 max-w-[280px]">
              {success
                ? "Password berhasil diubah! Mengarahkan ke halaman login..."
                : "Masukkan kata sandi baru untuk akunmu. Gunakan kombinasi huruf, angka, dan simbol."}
            </p>

            {/* Success State */}
            {success ? (
              <div className="w-full max-w-[301px]">
                <div className="bg-green-50 border border-green-200 rounded-[10px] px-4 py-3 mb-4">
                  <p className="text-[12px] text-green-700 text-center font-semibold">
                    ✅ Kata sandi berhasil diubah!
                  </p>
                </div>
                <Link href="/login" className="block w-full">
                  <button
                    type="button"
                    className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all"
                  >
                    Login Sekarang
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="w-full max-w-[301px] bg-red-50 border border-red-200 rounded-[10px] px-3 py-2 mb-3">
                    <p className="text-[11px] text-red-600 text-center">{error}</p>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-[301px] flex flex-col gap-[15px]"
                  noValidate
                >
                  {/* Password Baru */}
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="reset-password"
                        placeholder="Kata Sandi Baru"
                        value={form.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        autoComplete="new-password"
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
                    <PasswordStrengthBar password={form.password} />
                  </div>

                  {/* Konfirmasi Password */}
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      id="reset-confirm-password"
                      placeholder="Konfirmasi Kata Sandi"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      className={`${inputClass} pr-10 ${
                        form.confirmPassword && form.confirmPassword !== form.password
                          ? "border-red-300 focus:border-red-400"
                          : form.confirmPassword && form.confirmPassword === form.password
                          ? "border-green-400 focus:border-green-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      tabIndex={-1}
                      aria-label={showConfirm ? "Sembunyikan konfirmasi" : "Tampilkan konfirmasi"}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.confirmPassword && form.confirmPassword !== form.password && (
                    <p className="text-[10px] text-red-500 -mt-2 px-1">Password tidak cocok</p>
                  )}

                  <button
                    type="submit"
                    id="reset-submit"
                    disabled={isLoading}
                    className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      "Simpan Kata Sandi Baru"
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-[12px] text-black/60 hover:text-blue-600 hover:underline transition-colors"
                    >
                      ← Kembali ke Login
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
