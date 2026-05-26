"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Rekomendasi Acara", href: "/dashboard" },
    { name: "Kalender", href: "/calendar" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-[75px] bg-white border-b border-black/10 shadow-[0px_4px_2px_rgba(0,0,0,0.25)] z-50 flex items-center justify-center px-4 md:px-10">
      <div className="max-w-[1280px] w-full flex items-center justify-between gap-4 md:gap-20">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative w-[120px] h-[40px]">
            <Image src="/Logo.png" alt="Upvance Logo" fill className="object-contain" />
          </div>
        </Link>

        {/* Navigation & Search */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10">
          {/* Search Bar */}
          <div className="relative w-full max-w-[286px]">
            <input
              type="text"
              placeholder="Ketik acara yang dicari"
              className="w-full h-[38px] bg-[#6d6d6d]/20 border border-[#b4b4b4] rounded-[30px] pl-11 pr-4 text-[14px] outline-none focus:ring-2 focus:ring-[#2563eb]/20"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#707070]" />
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`text-[18px] font-semibold whitespace-nowrap transition-colors ${
                      isActive ? "text-[#2563eb]" : "text-[#212121] hover:text-[#2563eb]"
                    }`}
                  >
                    {link.name}
                  </Link>
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#2563eb] rounded-full" />
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Profile / Login */}
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="flex items-center gap-3 bg-[#2563eb] text-white px-6 py-1.5 rounded-[50px] hover:bg-blue-700 transition-colors">
              <User className="w-6 h-6" />
              <span className="text-[18px] font-semibold">Masuk</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
