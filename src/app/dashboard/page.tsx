"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/organism/Header";
import EventCard from "@/components/molecules/EventCard";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import type { Database } from "@/types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

interface EventsApiResponse {
  data: EventRow[] | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  } | null;
  error: string | null;
}

const ITEMS_PER_PAGE = 9;

export default function DashboardPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [meta, setMeta] = useState<EventsApiResponse["meta"]>(null);
  const [page, setPage] = useState(1);
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

      const res = await fetch(`/api/events?${params.toString()}`);
      const json: EventsApiResponse = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Gagal memuat acara");
        setEvents([]);
        setMeta(null);
        return;
      }

      setEvents(json.data ?? []);
      setMeta(json.meta);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet kamu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(page);
  }, [page, fetchEvents]);

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (meta && page < meta.total_pages) setPage((p) => p + 1);
  };

  const totalEvents = meta?.total ?? 0;
  const totalPages = meta?.total_pages ?? 1;

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
            sizes="100vw"
          />
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Title Section */}
          <div className="text-center mb-16">
            {isLoading ? (
              <div className="h-[44px] w-[400px] mx-auto bg-gray-200 animate-pulse rounded-lg" />
            ) : error ? null : (
              <h1 className="text-[36px] font-bold text-[#3e74eb] max-w-[557px] mx-auto leading-tight">
                Ada {totalEvents} Acara yang 100% cocok untuk kamu
              </h1>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-[#2563eb] animate-spin" />
              <p className="text-[#2563eb] font-medium">Memuat acara...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <AlertCircle className="w-12 h-12 text-red-400" />
              <p className="text-red-500 font-medium text-center max-w-md">{error}</p>
              <button
                onClick={() => fetchEvents(page)}
                className="mt-2 px-6 py-2 bg-[#2563eb] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-400 font-medium text-center">
                Belum ada acara yang tersedia saat ini.
              </p>
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && !error && events.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-[130px] justify-items-center mb-20">
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
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-10">
                  <button
                    onClick={handlePrev}
                    disabled={page <= 1}
                    className="flex items-center gap-2 bg-white border border-[#2563eb] text-[#2563eb] px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors w-[179px] h-[36px] justify-center shadow-[0px_4px_4px_rgba(0,0,0,0.1)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Sebelumnya</span>
                  </button>

                  <span className="text-[14px] text-gray-500 font-medium">
                    Halaman {page} dari {totalPages}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={page >= totalPages}
                    className="flex items-center gap-2 bg-white border border-[#2563eb] text-[#2563eb] px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors w-[179px] h-[36px] justify-center shadow-[0px_4px_4px_rgba(0,0,0,0.1)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
