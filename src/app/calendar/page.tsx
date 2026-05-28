"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/organism/Header";
import EventCard from "@/components/molecules/EventCard";
import { Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import type { Database } from "@/types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventCategory = EventRow["category"];

const months = [
  { label: "Jan", value: 1 },
  { label: "Feb", value: 2 },
  { label: "Mar", value: 3 },
  { label: "Apr", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Jun", value: 6 },
  { label: "Jul", value: 7 },
  { label: "Agu", value: 8 },
  { label: "Sep", value: 9 },
  { label: "Okt", value: 10 },
  { label: "Nov", value: 11 },
  { label: "Des", value: 12 },
];

const kategoriOptions: { label: string; value: EventCategory }[] = [
  { label: "Lomba", value: "Lomba" },
  { label: "Seminar", value: "Seminar" },
  { label: "Workshop", value: "Workshop" },
  { label: "Beasiswa", value: "Beasiswa" },
  { label: "Magang", value: "Magang" },
  { label: "Webinar", value: "Webinar" },
  { label: "Lainnya", value: "Lainnya" },
];

const ITEMS_PER_PAGE = 9;
const currentYear = new Date().getFullYear();

export default function CalendarPage() {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(new Set());
  const [isFreeOnly, setIsFreeOnly] = useState(false);

  const [events, setEvents] = useState<EventRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });

      // Filter berdasarkan kategori yang dipilih
      if (selectedCategories.size === 1) {
        params.set("category", Array.from(selectedCategories)[0]);
      }

      if (isFreeOnly) {
        params.set("is_free", "true");
      }

      const res = await fetch(`/api/events?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Gagal memuat acara");
        setEvents([]);
        return;
      }

      // Filter bulan di sisi klien (karena API belum support filter bulan)
      const allEvents: EventRow[] = json.data ?? [];
      const filtered = allEvents.filter((e) => {
        if (!e.start_date && !e.deadline) return true;
        const dateStr = e.start_date || e.deadline || "";
        const date = new Date(dateStr);
        return (
          date.getMonth() + 1 === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });

      setEvents(filtered);
      setTotalEvents(json.meta?.total ?? 0);
      setTotalPages(json.meta?.total_pages ?? 1);
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear, selectedCategories, isFreeOnly]);

  useEffect(() => {
    setPage(1);
    fetchEvents(1);
  }, [selectedMonth, selectedYear, selectedCategories, isFreeOnly]);

  const toggleCategory = (cat: EventCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

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

            {/* Gratis / Berbayar */}
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-bold text-[#080808]">Biaya</span>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[12.3px] font-extralight text-[#161616] group-hover:text-blue-600 transition-colors">
                  Gratis saja
                </span>
                <input
                  type="checkbox"
                  checked={isFreeOnly}
                  onChange={(e) => setIsFreeOnly(e.target.checked)}
                  className="w-[21px] h-[21px] rounded-[7px] border-[#16558f] text-[#16558f] focus:ring-[#16558f]"
                />
              </label>
            </div>

            <div className="h-px bg-[#cbd5e1] w-full" />

            {/* Kategori Section */}
            <div className="flex flex-col gap-2">
              <span className="text-[12.3px] font-bold text-[#161616]">Kategori</span>
              <div className="flex flex-col gap-2">
                {kategoriOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <span className="text-[12.3px] font-extralight text-[#161616] group-hover:text-blue-600 transition-colors">
                      {opt.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(opt.value)}
                      onChange={() => toggleCategory(opt.value)}
                      className="w-[21px] h-[21px] rounded-[7px] border-[#16558f] text-[#16558f] focus:ring-[#16558f]"
                    />
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
              <h1 className="text-[21px] font-bold text-[#161616]">{selectedYear}</h1>
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedYear((y) => y - 1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Tahun sebelumnya"
                >
                  <ChevronLeft className="w-[17.5px] h-[17.5px] text-[#16558f]" />
                </button>
                <button
                  onClick={() => setSelectedYear((y) => y + 1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Tahun berikutnya"
                >
                  <ChevronRight className="w-[17.5px] h-[17.5px] text-[#16558f]" />
                </button>
              </div>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-12 gap-[7px]">
              {months.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedMonth(m.value)}
                  className={`h-[42px] flex items-center justify-center rounded-[7px] border border-solid text-[12.3px] uppercase font-light transition-all shadow-sm
                    ${
                      selectedMonth === m.value
                        ? "bg-[#16558f] border-[#16558f] text-white"
                        : "bg-[#eaf6ff] border-[#eaf6ff] text-[#131516] hover:border-[#16558f]"
                    }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </section>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 text-[#2563eb] animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="flex flex-col items-center py-12 gap-3">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <p className="text-red-500 text-center">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && events.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-3">
              <p className="text-gray-400 text-center">
                Tidak ada acara pada bulan{" "}
                {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}.
              </p>
            </div>
          )}

          {/* Event Grid */}
          {!isLoading && !error && events.length > 0 && (
            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-10">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  location={event.location ?? "Indonesia"}
                  startDate={
                    event.start_date
                      ? new Date(event.start_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"
                  }
                  deadline={
                    event.deadline
                      ? new Date(event.deadline).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"
                  }
                  price={
                    event.is_free
                      ? "Gratis"
                      : event.price > 0
                      ? `Rp ${event.price.toLocaleString("id-ID")}`
                      : "Gratis"
                  }
                  organizer={""}
                  image={event.image_url ?? "/Logo.png"}
                  isVerified={event.is_verified}
                  category={event.category}
                />
              ))}
            </section>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-8 py-2 border border-[#2563eb] text-[#2563eb] font-bold rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Sebelumnya
              </button>
              <span className="text-[14px] text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-8 py-2 border border-[#2563eb] text-[#2563eb] font-bold rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Selanjutnya
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
