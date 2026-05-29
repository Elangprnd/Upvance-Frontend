"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, LogOut, ChevronDown, Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    // Ambil session user saat mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoadingUser(false);
    });

    // Subscribe ke perubahan auth state (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    // 1. Supabase signOut
    await supabase.auth.signOut();
    
    // 2. Hard clear cookies via API (to remove all chunks)
    try { await fetch('/api/auth/clear', { method: 'POST' }); } catch (e) {}
    
    // 3. Fallback client clear
    document.cookie.split(';').forEach(c => {
      const name = c.split('=')[0].trim();
      if (name.startsWith('sb-')) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    });

    setShowDropdown(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Rekomendasi Acara", href: "/dashboard" },
    { name: "Kalender", href: "/calendar" },
    { name: "About Us", href: "/about" },
  ];

  // Ambil nama tampilan user
  const displayName: string =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Pengguna";
  const avatarUrl: string | null =
    (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <header className="fixed top-0 left-0 w-full h-[75px] bg-white border-b border-black/10 shadow-[0px_4px_2px_rgba(0,0,0,0.25)] z-50 flex items-center justify-center px-4 md:px-10">
      <div className="max-w-[1280px] w-full flex items-center justify-between gap-4 md:gap-20">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="relative w-[120px] h-[40px]">
            <Image
              src="/Logo.png"
              alt="Upvance Logo"
              fill
              className="object-contain"
              sizes="120px"
            />
          </div>
        </Link>

        {/* Navigation & Search */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full max-w-[286px]">
            <input
              type="text"
              placeholder="Ketik acara yang dicari"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[38px] bg-[#6d6d6d]/20 border border-[#b4b4b4] rounded-[30px] pl-11 pr-4 text-[14px] outline-none focus:ring-2 focus:ring-[#2563eb]/20"
            />
            <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-[#707070]" />
            </button>
          </form>

          {/* Nav Links */}
          <nav className="flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`text-[18px] font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-[#2563eb]"
                        : "text-[#212121] hover:text-[#2563eb]"
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

        {/* User Area */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoadingUser ? (
            // Skeleton loading agar tidak layout shift
            <div className="w-[120px] h-[38px] bg-gray-100 rounded-[50px] animate-pulse" />
          ) : user ? (
            // ─── User sudah login: tampilkan avatar + nama + dropdown ───
            <div className="relative">
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="flex items-center gap-2 bg-[#f0f5ff] border border-[#2563eb]/20 text-[#2563eb] px-4 py-1.5 rounded-[50px] hover:bg-[#e0ecff] transition-colors"
                aria-label="Menu pengguna"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center">
                    <span className="text-white text-[11px] font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-[14px] font-semibold max-w-[100px] truncate">
                  {displayName}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  {/* Overlay untuk tutup dropdown saat klik di luar */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-gray-100 rounded-[12px] shadow-lg py-1 w-[200px] z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-[12px] text-gray-500">Masuk sebagai</p>
                      <p className="text-[13px] font-semibold text-gray-800 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/settings/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Edit Profil
                    </Link>
                    <Link
                      href="/bookmarks"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                      Bookmark Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // ─── User belum login: tampilkan tombol Masuk ───
            <Link href="/login">
              <button className="flex items-center gap-3 bg-[#2563eb] text-white px-6 py-1.5 rounded-[50px] hover:bg-blue-700 transition-colors">
                <User className="w-6 h-6" />
                <span className="text-[18px] font-semibold">Masuk</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
