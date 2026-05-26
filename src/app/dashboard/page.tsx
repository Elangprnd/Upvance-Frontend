"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/organism/Header";
import EventCard from "@/components/molecules/EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { eventsData } from "@/lib/eventsData";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full relative bg-white font-['Inter',sans-serif]">
      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-[110px] pb-20 px-4 md:px-10 relative z-10 min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/Background.png"
            alt="Background Decor"
            fill
            className="object-cover opacity-100"
            priority
          />
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-[36px] font-bold text-[#3e74eb] max-w-[557px] mx-auto leading-tight">
              Ada {eventsData.length} Kompetisi yang 100% cocok dengan profil kamu
            </h1>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-[130px] justify-items-center mb-20">
            {eventsData.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-10">
            <button className="flex items-center gap-2 bg-white border border-[#2563eb] text-[#2563eb] px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors w-[179px] h-[36px] justify-center shadow-[0px_4px_4px_rgba(0,0,0,0.1)]">
              <ChevronLeft className="w-5 h-5" />
              <span>Sebelumnya</span>
            </button>
            <button className="flex items-center gap-2 bg-white border border-[#2563eb] text-[#2563eb] px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors w-[179px] h-[36px] justify-center shadow-[0px_4px_4px_rgba(0,0,0,0.1)]">
              <span>Selanjutnya</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Decorative Elements from Figma (Optional, if not fully covered by Background.png) */}
      {/* 
        The Background.png likely contains the stars and ellipses, 
        but if it doesn't, we could add them here using CSS or individual assets.
      */}
    </div>
  );
}
