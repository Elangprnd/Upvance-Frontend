"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import AuthSidebar from "@/components/organism/AuthSidebar";

function ForgotPasswordContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const inputClass =
    "w-full h-[40px] px-[20px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none text-[12px] text-black placeholder:text-black/50 transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Masukkan email yang valid");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Gagal mengirim email. Coba lagi.");
        setIsLoading(false);
        return;
      }

      setSent(true);
      setIsLoading(false);
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
              <Mail className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-[24px] font-bold text-center text-black mb-2">
              Lupa Kata Sandi?
            </h2>
            <p className="text-[13px] text-black/60 text-center mb-6 max-w-[280px]">
              {sent
                ? "Cek inbox atau folder spam email kamu. Link akan kedaluwarsa dalam beberapa menit."
                : "Masukkan email akunmu dan kami akan mengirimkan link untuk mengatur ulang kata sandi."}
            </p>

            {/* Sent Success State */}
            {sent ? (
              <div className="w-full max-w-[301px] flex flex-col gap-4 items-center">
                <div className="w-full bg-green-50 border border-green-200 rounded-[10px] px-4 py-3">
                  <p className="text-[12px] text-green-700 text-center font-semibold">
                    📧 Link telah dikirim ke <span className="break-all">{email}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="text-[12px] text-blue-600 hover:underline"
                >
                  Kirim ke email lain
                </button>
                <Link href="/login" className="w-full block">
                  <button
                    type="button"
                    className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Kembali ke Login
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
                  <input
                    type="email"
                    id="forgot-email"
                    placeholder="Masukkan email kamu"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    id="forgot-submit"
                    disabled={isLoading}
                    className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      "Kirim Link Reset"
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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
