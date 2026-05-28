"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import AuthSidebar from "@/components/organism/AuthSidebar";

const OTP_LENGTH = 8;

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer untuk resend
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Auto-focus ke input pertama
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Hanya terima angka
    const digit = value.replace(/\D/g, "").slice(-1);
    setError(null);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus ke kotak berikutnya
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus ke kotak setelah digit terakhir yang ditempel
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const otpValue = otp.join("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < OTP_LENGTH) {
      setError(`Masukkan semua ${OTP_LENGTH} digit kode OTP`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Kode OTP salah atau sudah kedaluwarsa");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet kamu.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(60);
    setError(null);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    // Resend dilakukan dari halaman register/login saja,
    // jadi cukup arahkan balik ke register
    router.push(`/register?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] overflow-x-hidden font-['Inter',sans-serif]">
      <div className="flex-1 lg:flex-none w-full lg:max-w-full flex min-h-screen relative overflow-hidden">
        <AuthSidebar />

        {/* OTP Form Section */}
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

          {/* OTP Card */}
          <div className="w-full max-w-[450px] bg-[#D9D9D9]/80 backdrop-blur-xl rounded-[25px] p-8 md:p-12 shadow-[0px_40px_40px_0px_rgba(0,0,0,0.24),0px_10px_22px_0px_rgba(0,0,0,0.27)] relative z-10 flex flex-col items-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-5">
              <MailCheck className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-[24px] font-bold text-center text-black mb-2">
              Verifikasi Email
            </h2>

            <p className="text-[13px] text-black/60 text-center mb-6 max-w-[280px]">
              Kami telah mengirimkan kode <span className="font-bold text-black/80">{OTP_LENGTH} digit</span> ke{" "}
              <span className="font-semibold text-blue-600 break-all">
                {email || "email kamu"}
              </span>
              . Periksa juga folder spam.
            </p>

            {/* Status / Error */}
            {success ? (
              <div className="w-full bg-green-50 border border-green-200 rounded-[10px] px-4 py-3 mb-4">
                <p className="text-[12px] text-green-700 text-center font-semibold">
                  ✅ Verifikasi berhasil! Mengarahkan ke dashboard...
                </p>
              </div>
            ) : error ? (
              <div className="w-full bg-red-50 border border-red-200 rounded-[10px] px-3 py-2 mb-4">
                <p className="text-[11px] text-red-600 text-center">{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
              {/* OTP Input Boxes */}
              <div
                className="flex gap-2 justify-center"
                onPaste={handlePaste}
              >
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    id={`otp-digit-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={isLoading || success}
                    aria-label={`Digit OTP ke-${i + 1}`}
                    className={`
                      w-[42px] h-[50px] text-center text-[20px] font-bold
                      bg-white rounded-[12px]
                      shadow-[0px_1px_2px_rgba(0,0,0,0.25)]
                      border-2 outline-none transition-all
                      ${otp[i]
                        ? "border-blue-500 text-blue-700"
                        : "border-transparent text-black"
                      }
                      focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20
                      disabled:opacity-60
                    `}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="otp-submit"
                disabled={isLoading || success || otpValue.length < OTP_LENGTH}
                className="w-full max-w-[301px] h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  "Verifikasi Sekarang"
                )}
              </button>

              {/* Resend */}
              <p className="text-[12px] text-black/60 text-center">
                Tidak menerima kode?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Kirim ulang
                  </button>
                ) : (
                  <span className="text-black/40">
                    Kirim ulang ({resendTimer}s)
                  </span>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOTPContent />
    </Suspense>
  );
}
