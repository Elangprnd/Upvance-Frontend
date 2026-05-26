"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  Bell, 
  ShieldCheck, 
  Sparkles,
  Apple
} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] overflow-x-hidden font-['Inter',sans-serif] items-center justify-center">
      <div className="flex-1 lg:flex-none w-full lg:max-w-full flex min-h-screen relative overflow-hidden">
        
        {/* Sidebar - Left Side */}
        <div className="hidden lg:flex lg:w-[450px] xl:w-[529px] relative flex-col bg-gradient-to-b from-[#2563eb] from-[20.673%] to-[#14cb72] p-8 xl:p-[50px] text-white overflow-hidden shrink-0 min-h-screen">
            {/* Logo Section */}
            <div className="flex items-center mb-12 xl:mb-[60px] relative z-10">
                <div className="w-[150px] h-[60px] relative">
                    <Image src="/Logo.png" alt="Upvance Logo" fill className="object-contain" />
                </div>
            </div>

            {/* Hero Text */}
            <div className="mb-12 xl:mb-[60px] relative z-10 max-w-[422px]">
                <h1 className="text-[32px] font-bold leading-[44px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                    Lebih Mudah Untuk Akses{" "}
                    <span className="text-[#fbc02d]">Ribun Informasi Acara Luar</span>
                </h1>
            </div>

            {/* Features List with Lucide Icon Fallbacks */}
            <div className="space-y-[30px] relative z-10">
                <FeatureItem 
                    icon={<Sparkles className="w-8 h-8" />}
                    title="Rekomendasi Acara Otomatis"
                    description="100% sesuai profil diri"
                />
                <FeatureItem 
                    icon={<Calendar className="w-8 h-8" />}
                    title="Kalender Event"
                    description="Akses info Acara, Magang, Webinar, Lomba, dan Volunteer sepanjang tahun"
                />
                <FeatureItem 
                    icon={<Bell className="w-8 h-8" />}
                    title="Reminder Deadline"
                    description="Pengingat langsung ke Google Calender ketika menyimpan acara dan lainnya"
                />
                <FeatureItem 
                    icon={<ShieldCheck className="w-8 h-8" />}
                    title="Acara Terverifikasi"
                    description="Informasi acara yang sudah diseleksi secara ketat sehingga minim acara palsu"
                />
            </div>

            {/* Decorative background decoration in sidebar */}
            <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Login Form Section - Right Side */}
        <div className="flex-1 relative flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-white min-h-screen">
            {/* Main Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/background-auth.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            {/* Decorative Shapes using CSS Gradients (More stable than remote images) */}
            <div className="absolute top-[5%] right-[2%] w-[15vw] max-w-[200px] aspect-square bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-2xl pointer-events-none z-0" />
            <div className="absolute bottom-[5%] right-[2%] w-[18vw] max-w-[250px] aspect-square bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute top-[8%] left-[10%] w-[18vw] max-w-[300px] aspect-square bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
            
            {/* Login Card */}
            <div className="w-full max-w-[450px] bg-[#D9D9D9]/80 backdrop-blur-xl rounded-[25px] p-8 md:p-12 shadow-[0px_251px_70px_0px_rgba(0,0,0,0.01),0px_160px_64px_0px_rgba(0,0,0,0.04),0px_90px_54px_0px_rgba(0,0,0,0.14),0px_40px_40px_0px_rgba(0,0,0,0.24),0px_10px_22px_0px_rgba(0,0,0,0.27)] relative z-10 flex flex-col items-center">
                <h2 className="text-[24px] font-bold text-center text-black mb-[40px] font-['Inter',sans-serif]">
                    Masuk ke Akun Anda
                </h2>

                <div className="w-full max-w-[301px] flex flex-col gap-[17px]">
                    <div className="space-y-[15px]">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full h-[40px] px-[30px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] border-none focus:ring-2 focus:ring-blue-500/20 outline-none italic text-[12px] text-black placeholder:text-black/50"
                        />
                        <div className="space-y-[17px]">
                            <input
                                type="password"
                                placeholder="Kata Sandi"
                                className="w-full h-[40px] px-[30px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] border-none focus:ring-2 focus:ring-blue-500/20 outline-none italic text-[12px] text-black placeholder:text-black/50"
                            />
                            <div className="flex justify-end">
                                <Link href="#" className="text-[12px] text-black font-normal hover:underline">
                                    Lupa Kata Sandi?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-[17px] mt-[32px]">
                        <Link href="/dashboard" className="block w-full">
                            <button
                                type="button"
                                className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98]"
                            >
                                Masuk
                            </button>
                        </Link>

                        <div className="flex items-center gap-[17px]">
                            <div className="h-[1px] flex-1 bg-black/10" />
                            <span className="text-[12px] text-black font-normal shrink-0">Atau</span>
                            <div className="h-[1px] flex-1 bg-black/10" />
                        </div>

                        <div className="space-y-[17px]">
                            <Link href="/register" className="block w-full">
                                <button className="w-full h-[40px] bg-white text-black font-bold text-[12px] rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all active:scale-[0.98]">
                                    Daftar Akun
                                </button>
                            </Link>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button className="h-[40px] flex items-center justify-center gap-[10px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all">
                                    <div className="w-[20px] h-[20px] relative flex items-center justify-center bg-red-100 rounded-full">
                                        <span className="text-red-500 font-bold text-sm">G</span>
                                    </div>
                                    <span className="text-[12px] font-normal text-black">Google</span>
                                </button>

                                <button className="h-[40px] flex items-center justify-center gap-[10px] bg-white rounded-[50px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] hover:bg-gray-50 transition-all">
                                    <div className="w-[20px] h-[20px] relative flex items-center justify-center bg-black rounded-full">
                                        <Apple className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-[12px] font-normal text-black">Apple</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string
}) {
  return (
    <div className="flex gap-[15px] items-center">
      <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl text-white">
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold text-[23px] text-white leading-tight drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">{title}</h3>
        <p className="text-[18px] font-normal text-white opacity-90 leading-snug max-w-[350px]">{description}</p>
      </div>
    </div>
  );
}
