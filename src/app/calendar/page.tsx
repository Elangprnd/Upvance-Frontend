"use client";

import React, { useState } from "react";
import Header from "@/components/organism/Header";
import EventCard from "@/components/molecules/EventCard";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { eventsData } from "@/lib/eventsData";

const months = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

const jenjangOptions = [
  "SMP", "SMA", "D2", "D3", "D4", "S1", "S2", "S3", "Non-Degree", "Gap Year", "Profesi"
];

const kategoriOptions = [
  "Magang", "Kompetisi", "Volunteer", "Exchange", "Webinar", "Bootcamp"
];

export default function CalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState("Mei");

  return (
    <main className="min-h-screen bg-white pt-[100px] pb-20 px-4 md:px-10">
      <Header />
      
      <div className="max-w-[1280px] mx-auto flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-[252px] shrink-0 sticky top-[100px] h-fit">
          <div className="bg-[#eaf6ff] rounded-[10.5px] p-3.5 flex flex-col gap-3.5">
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#cbd5e1]">
              <Filter className="w-6 h-6 text-[#080808]" />
              <span className="text-[14px] font-bold text-[#080808]">Filter</span>
            </div>

            {/* Jenjang Section */}
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-bold text-[#080808]">Jenjang</span>
              <div className="flex flex-col gap-2">
                {jenjangOptions.map((option) => (
                  <label key={option} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-[12.3px] font-extralight text-[#161616] group-hover:text-blue-600 transition-colors">
                      {option}
                    </span>
                    <input type="checkbox" className="w-[21px] h-[21px] rounded-[7px] border-[#16558f] text-[#16558f] focus:ring-[#16558f]" />
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#cbd5e1] w-full" />

            {/* Kategori Section */}
            <div className="flex flex-col gap-2">
              <span className="text-[12.3px] font-bold text-[#161616]">Kategori</span>
              <div className="flex flex-col gap-2">
                {kategoriOptions.map((option) => (
                  <label key={option} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-[12.3px] font-extralight text-[#161616] group-hover:text-blue-600 transition-colors">
                      {option}
                    </span>
                    <input type="checkbox" className="w-[21px] h-[21px] rounded-[7px] border-[#16558f] text-[#16558f] focus:ring-[#16558f]" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Year and Month Navigation */}
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center gap-2">
              <h1 className="text-[21px] font-bold text-[#161616]">2026</h1>
              <div className="flex items-center">
                <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-[17.5px] h-[17.5px] text-[#16558f]" />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-[17.5px] h-[17.5px] text-[#16558f]" />
                </button>
              </div>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-12 gap-[7px]">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`h-[42px] flex items-center justify-center rounded-[7px] border border-solid text-[12.3px] uppercase font-light transition-all shadow-sm
                    ${selectedMonth === month 
                      ? "bg-[#16558f] border-[#16558f] text-white" 
                      : "bg-[#eaf6ff] border-[#eaf6ff] text-[#131516] hover:border-[#16558f]"
                    }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </section>

          {/* Event Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-10">
            {eventsData.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </section>
          
          {/* Pagination Navigation Placeholder */}
          <div className="flex justify-between items-center mt-10">
             <button className="px-8 py-2 border border-[#2563eb] text-[#2563eb] font-bold rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors">
                <ChevronLeft className="w-5 h-5" />
                Sebelumnya
             </button>
             <button className="px-8 py-2 border border-[#2563eb] text-[#2563eb] font-bold rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors">
                Selanjutnya
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </main>
  );
}
