"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Header from "@/components/organism/Header";
import EventCard from "@/components/molecules/EventCard";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, X } from "lucide-react";
import type { Database } from "@/types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventCategory = EventRow["category"];

interface EventsApiResponse {
  data: EventRow[] | null;
  meta: { total: number; page: number; limit: number; total_pages: number } | null;
  error: string | null;
}

const ITEMS_PER_PAGE = 9;

// Semua kategori yang tersedia
const ALL_CATEGORIES: { label: string; value: EventCategory; color: string; segment: "umum" | "green" }[] = [
  { label: "Lomba",     value: "Lomba",     color: "bg-blue-100 text-blue-700 border-blue-300",      segment: "umum"  },
  { label: "Seminar",   value: "Seminar",   color: "bg-purple-100 text-purple-700 border-purple-300", segment: "umum"  },
  { label: "Workshop",  value: "Workshop",  color: "bg-orange-100 text-orange-700 border-orange-300", segment: "umum"  },
  { label: "Beasiswa",  value: "Beasiswa",  color: "bg-green-100 text-green-700 border-green-300",    segment: "umum"  },
  { label: "Magang",    value: "Magang",    color: "bg-teal-100 text-teal-700 border-teal-300",       segment: "umum"  },
  { label: "Webinar",   value: "Webinar",   color: "bg-indigo-100 text-indigo-700 border-indigo-300", segment: "umum"  },
  { label: "Volunteer", value: "Volunteer", color: "bg-lime-100 text-lime-700 border-lime-300",       segment: "green" },
  { label: "Greenvity", value: "Greenvity", color: "bg-emerald-100 text-emerald-700 border-emerald-300", segment: "green" },
  { label: "Lainnya",   value: "Lainnya",   color: "bg-gray-100 text-gray-600 border-gray-300",       segment: "umum"  },
];

const GREEN_CATEGORIES: EventCategory[] = ["Volunteer", "Greenvity"];
const UMUM_CATEGORIES: EventCategory[] = ALL_CATEGORIES.filter(c => c.segment === "umum").map(c => c.value);

function DashboardContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [events, setEvents] = useState<EventRow[]>([]);
  const [meta, setMeta] = useState<EventsApiResponse["meta"]>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [activeSegment, setActiveSegment] = useState<"rekomendasi" | "all" | "umum" | "green">("rekomendasi");
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(new Set());
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [userInterests, setUserInterests] = useState<EventCategory[]>([]);

  useEffect(() => {
    // Ambil minat user saat pertama kali load
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          supabase.from('profiles').select('interests').eq('id', data.user.id).single()
            .then(({ data: profile }) => {
              if (profile?.interests && profile.interests.length > 0) {
                // Konversi minat ke kategori yang valid
                const mapped = profile.interests.filter((i: string) => ALL_CATEGORIES.some(c => c.value === i)) as EventCategory[];
                setUserInterests(mapped.length > 0 ? mapped : UMUM_CATEGORIES);
              }
            });
        }
      });
    });
  }, []);

  const fetchEvents = useCallback(async (currentPage: number, search: string, cats: Set<EventCategory>, freeOnly: boolean, segment: string, interests: EventCategory[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(ITEMS_PER_PAGE) });
      if (search) params.set("search", search);
      if (freeOnly) params.set("is_free", "true");

      // Resolve kategori
      let activeCats: EventCategory[] = [];
      if (cats.size > 0) {
        activeCats = Array.from(cats);
      } else if (segment === "rekomendasi") {
        activeCats = interests.length > 0 ? interests : UMUM_CATEGORIES;
      } else if (segment === "umum") {
        activeCats = UMUM_CATEGORIES;
      } else if (segment === "green") {
        activeCats = GREEN_CATEGORIES;
      }

      if (activeCats.length === 1) {
        params.set("category", activeCats[0]);
      } else if (activeCats.length > 1) {
        params.set("categories", activeCats.join(","));
      }


      const res = await fetch(`/api/events?${params.toString()}`);

      // Jika middleware mendeteksi cookie overflow (431 prevention)
      if (res.status === 401) {
        const json401 = await res.json().catch(() => ({}));
        if (json401.error === 'session_expired') {
          // Clear semua cookie sb- lalu redirect ke login
          document.cookie.split(';').forEach(c => {
            const name = c.split('=')[0].trim();
            if (name.startsWith('sb-')) {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
            }
          });
          window.location.href = '/login?reason=session_reset';
          return;
        }
        setError('Sesi berakhir, silakan login ulang.');
        setEvents([]); setMeta(null);
        return;
      }

      const json: EventsApiResponse = await res.json();
      if (!res.ok || json.error) { setError(json.error || "Gagal memuat acara"); setEvents([]); setMeta(null); return; }
      setEvents(json.data ?? []);
      setMeta(json.meta);
    } catch (err) {
      console.error(err);
      // Jika terjadi Network Error (seperti HTTP 431 Header Too Large)
      setError("Mereset sesi yang korup... mohon tunggu.");
      try {
        await fetch('/api/auth/clear', { method: 'POST' });
        document.cookie.split(';').forEach(c => {
          const name = c.split('=')[0].trim();
          if (name.startsWith('sb-')) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        });
        window.location.href = '/login?reason=session_reset';
      } catch {
        setError("Gagal memuat acara. Coba refresh halaman.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { setPage(1); }, [searchQuery, selectedCategories, isFreeOnly, activeSegment, userInterests]);
  useEffect(() => { fetchEvents(page, searchQuery, selectedCategories, isFreeOnly, activeSegment, userInterests); }, [page, searchQuery, selectedCategories, isFreeOnly, activeSegment, userInterests, fetchEvents]);

  const toggleCategory = (cat: EventCategory) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
    setActiveSegment("all"); // reset segment saat pilih kategori manual
  };

  const clearFilters = () => { setSelectedCategories(new Set()); setIsFreeOnly(false); setActiveSegment("rekomendasi"); };
  const hasFilter = selectedCategories.size > 0 || isFreeOnly || activeSegment !== "rekomendasi";

  const totalEvents = meta?.total ?? 0;
  const totalPages = meta?.total_pages ?? 1;

  return (
    <div className="min-h-screen w-full relative bg-white font-['Inter',sans-serif]">
      <Header />
      <main className="pt-[110px] pb-20 px-4 md:px-10 relative z-10 min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image src="/Background.png" alt="Background Decor" fill className="object-cover opacity-100" priority sizes="100vw" />
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Title */}
          <div className="text-center mb-8">
            {isLoading ? (
              <div className="h-[44px] w-[400px] mx-auto bg-gray-200 animate-pulse rounded-lg" />
            ) : error ? null : (
              <h1 className="text-[36px] font-bold text-[#3e74eb] max-w-[557px] mx-auto leading-tight">
                {searchQuery
                  ? `Hasil pencarian "${searchQuery}"`
                  : activeSegment === "green"
                  ? "🌿 Acara Green & Volunteer"
                  : activeSegment === "umum"
                  ? "🎓 Acara Umum Mahasiswa"
                  : `Ada ${totalEvents} Acara untuk kamu`}
              </h1>
            )}
          </div>

          {/* ─── FILTER SECTION ─── */}
          <div className="mb-10 flex flex-col gap-4">
            {/* Segment tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: "Untukmu ✨",        value: "rekomendasi" as const },
                { label: "Semua",             value: "all"         as const },
                { label: "Umum",              value: "umum"        as const },
                { label: "Green & Volunteer", value: "green"       as const },
              ].map((seg) => (
                <button
                  key={seg.value}
                  onClick={() => { setActiveSegment(seg.value); setSelectedCategories(new Set()); }}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${
                    activeSegment === seg.value
                      ? seg.value === "green"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-[#2563eb] text-white border-[#2563eb]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#2563eb] hover:text-[#2563eb]"
                  }`}
                >
                  {seg.label}
                </button>
              ))}

              {/* Gratis toggle */}
              <button
                onClick={() => setIsFreeOnly(p => !p)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${
                  isFreeOnly
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-500 hover:text-green-600"
                }`}
              >
                Gratis
              </button>

              {hasFilter && (
                <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-[12px] text-red-500 hover:bg-red-50 rounded-full border border-red-200 transition-colors">
                  <X className="w-3 h-3" /> Reset Filter
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold border transition-all ${
                    selectedCategories.has(cat.value)
                      ? "bg-[#2563eb] text-white border-[#2563eb] scale-105"
                      : `${cat.color} hover:scale-105`
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
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
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-400 font-medium text-center">
                Belum ada acara yang tersedia{hasFilter ? " dengan filter ini" : ""}.
              </p>
              {hasFilter && (
                <button onClick={clearFilters} className="text-[#2563eb] hover:underline text-sm font-semibold">
                  Hapus semua filter
                </button>
              )}
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && !error && events.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-20">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    location={event.location ?? "Indonesia"}
                    startDate={event.start_date ? new Date(event.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    deadline={event.deadline ? new Date(event.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    price={event.is_free ? "Gratis" : event.price > 0 ? `Rp ${event.price.toLocaleString("id-ID")}` : "Gratis"}
                    image={event.image_url ?? "/Logo.png"}
                    isVerified={event.is_verified}
                    category={event.category}
                    isOnline={event.is_online}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    className="flex items-center gap-2 bg-white border border-[#2563eb] text-[#2563eb] px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors w-[179px] h-[36px] justify-center shadow disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-5 h-5" /><span>Sebelumnya</span>
                  </button>
                  <span className="text-[14px] text-gray-500 font-medium">Halaman {page} dari {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="flex items-center gap-2 bg-white border border-[#2563eb] text-[#2563eb] px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors w-[179px] h-[36px] justify-center shadow disabled:opacity-40 disabled:cursor-not-allowed">
                    <span>Selanjutnya</span><ChevronRight className="w-5 h-5" />
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

export default function DashboardPage() {
  return <Suspense fallback={null}><DashboardContent /></Suspense>;
}
