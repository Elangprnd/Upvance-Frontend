"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/organism/Header";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle2,
  Calendar,
  CalendarPlus,
  CircleDollarSign,
  ChevronLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Loader2,
  AlertCircle,
  Globe,
} from "lucide-react";
import type { Database } from "@/types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

interface EventDetailWithOrganizer extends EventRow {
  organizers: {
    id: string;
    org_name: string;
    org_logo_url: string | null;
    is_verified: boolean;
    tier: string;
  } | null;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(isFree: boolean, price: number): string {
  if (isFree) return "Gratis";
  if (price > 0) return `Rp ${price.toLocaleString("id-ID")}`;
  return "Gratis";
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [event, setEvent] = useState<EventDetailWithOrganizer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events/${id}`);
        const json = await res.json();

        if (!res.ok || json.error) {
          setError(json.error || "Event tidak ditemukan");
          return;
        }

        setEvent(json.data);
      } catch {
        setError("Gagal terhubung ke server. Periksa koneksi internet kamu.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchEvent();
  }, [id]);

  // Cek bookmark status
  useEffect(() => {
    if (!id) return;
    fetch(`/api/bookmarks?event_id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.bookmarked) setIsBookmarked(true); })
      .catch(() => {});
  }, [id]);

  const handleBookmark = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/events/${id}`)}`);
      return;
    }
    setBookmarkLoading(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: id }),
      });
      const json = await res.json();
      if (res.ok) setIsBookmarked(json.bookmarked);
    } catch {} finally {
      setBookmarkLoading(false);
    }
  };

  const handleAddToCalendar = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/events/${id}`)}`);
      return;
    }
    if (!event) return;

    // Build Google Calendar URL (no API key needed)
    const title = encodeURIComponent(`[Upvance] ${event.title}`);
    const details = encodeURIComponent(
      `${event.description ?? ''}\n\nLink acara: ${typeof window !== 'undefined' ? window.location.href : ''}`
    );
    const location = encodeURIComponent(event.is_online ? 'Online' : (event.location ?? 'Indonesia'));

    const formatGCalDate = (iso: string | null): string => {
      if (!iso) return '';
      return iso.replace(/[-:]/g, '').replace('T', 'T').split('.')[0] + 'Z';
    };

    const startDate = event.start_date ? formatGCalDate(event.start_date) : formatGCalDate(event.deadline);
    const endDate = event.end_date ? formatGCalDate(event.end_date) : startDate;

    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(calUrl, '_blank');
  };

  const handleRegister = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/events/${id}`)}`);
      return;
    }
    if (event?.event_url) window.open(event.event_url, '_blank');
  };

  // Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-[100px] pb-20 px-4 md:px-10">
        <Header />
        <div className="max-w-[1280px] mx-auto flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#2563eb] animate-spin" />
          <p className="text-[#2563eb] font-medium">Memuat detail acara...</p>
        </div>
      </main>
    );
  }

  // Error State
  if (error || !event) {
    return (
      <main className="min-h-screen bg-white pt-[100px] pb-20 px-4 md:px-10">
        <Header />
        <div className="max-w-[1280px] mx-auto flex flex-col items-center justify-center py-20 gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <h1 className="text-2xl font-bold text-gray-800">
            {error || "Acara tidak ditemukan"}
          </h1>
          <Link
            href="/dashboard"
            className="mt-4 px-6 py-2 bg-[#2563eb] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const orgName = event.organizers?.org_name ?? "";
  const orgLogo = event.organizers?.org_logo_url ?? null;

  return (
    <main className="min-h-screen bg-white pt-[100px] pb-20 px-4 md:px-10">
      <Header />

      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb / Back Button */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[#2563eb] font-semibold mb-8 hover:underline"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali ke Beranda
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Event Poster */}
          <div className="w-full lg:w-[403px] shrink-0">
            <div className="relative w-full aspect-[403/537] rounded-[20px] overflow-hidden shadow-lg bg-gray-100">
              <Image
                src={event.image_url ?? "/Logo.png"}
                alt={event.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 403px"
              />
            </div>
          </div>

          {/* Right Column: Event Info */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Title and Verification */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-[32px] font-bold text-[#161616] leading-tight">
                  {event.title}
                </h1>
                {event.is_verified && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#2563eb]" />
                    <span className="text-[18px] font-bold text-[#2563eb]">
                      Verified
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {event.category && (
                  <span className="px-4 py-1 bg-[#eaf6ff] border border-black/10 rounded-full text-[13px] font-semibold">
                    {event.category}
                  </span>
                )}
                {event.is_featured && (
                  <span className="px-4 py-1 bg-yellow-50 border border-yellow-300 rounded-full text-[13px] font-semibold text-yellow-700">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>

            <hr className="border-black/10" />

            {/* Event Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-bold text-[#161616]">
                  Lokasi
                </span>
                <div className="flex items-center gap-2 text-[#777]">
                  {event.is_online ? (
                    <Globe className="w-6 h-6 text-[#2563eb]" />
                  ) : (
                    <MapPin className="w-6 h-6 text-[#2563eb]" />
                  )}
                  <span className="text-[13px] font-medium">
                    {event.is_online
                      ? "Online"
                      : event.location ?? "Indonesia"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-bold text-[#161616]">
                  Mulai Acara
                </span>
                <div className="flex items-center gap-2 text-[#777]">
                  <Calendar className="w-6 h-6 text-[#2563eb]" />
                  <span className="text-[13px] font-medium">
                    {formatDate(event.start_date)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-bold text-[#161616]">
                  Deadline Pendaftaran
                </span>
                <div className="flex items-center gap-2 text-[#e53835]">
                  <Calendar className="w-6 h-6" />
                  <span className="text-[13px] font-medium font-bold">
                    {formatDate(event.deadline)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-bold text-[#161616]">
                  Pembayaran
                </span>
                <div className="flex items-center gap-2 text-[#0e0e0f]">
                  <CircleDollarSign className="w-6 h-6 text-[#2563eb]" />
                  <span className="text-[13px] font-medium">
                    {formatPrice(event.is_free, event.price)}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-black/10" />

            {/* Organizer Section */}
            <div className="flex items-center gap-4">
              <div className="w-[63px] h-[69px] relative bg-gray-50 rounded overflow-hidden">
                {orgLogo && (
                  <Image
                    src={orgLogo}
                    alt={orgName}
                    fill
                    className="object-contain"
                    sizes="63px"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-[#bababa]">
                  Diselenggarakan Oleh
                </span>
                <span className="text-[20px] font-bold text-black">
                  {orgName || "Penyelenggara"}
                </span>
              </div>
            </div>

            {/* Description Section */}
            {event.description && (
              <div className="flex flex-col gap-3 mt-4">
                <h2 className="text-[20px] font-bold text-black">Deskripsi</h2>
                <p className="text-[16px] text-[#777] leading-[1.6] text-justify whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}

            {/* Event URL / Booklet Link */}
            {event.event_url && (
              <a
                href={event.event_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex rounded-[20px] overflow-hidden shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)] h-[58px] hover:shadow-md transition-shadow"
              >
                <div className="w-[158px] bg-[#23458f4d] flex items-center justify-center">
                  <span className="text-[16px] font-bold text-black">
                    Link Acara
                  </span>
                </div>
                <div className="flex-1 bg-[#acbde34d] flex items-center justify-between px-6">
                  <span className="text-[16px] text-[#777] truncate">
                    Buka halaman pendaftaran
                  </span>
                  <ExternalLink className="w-5 h-5 text-[#777] shrink-0" />
                </div>
              </a>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8 self-end flex-wrap">
              <button
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className={`flex items-center gap-2 px-6 py-2 border rounded-lg font-bold transition-colors disabled:opacity-50 ${
                  isBookmarked
                    ? "border-[#2563eb] bg-[#2563eb] text-white"
                    : "border-[#2563eb] text-[#2563eb] hover:bg-blue-50"
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                {isBookmarked ? "Tersimpan" : "Bookmark"}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link berhasil disalin!");
                  }
                }}
                className="flex items-center gap-2 px-6 py-2 border border-[#2563eb] text-[#2563eb] rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Bagikan
              </button>
              <button
                onClick={handleAddToCalendar}
                className="flex items-center gap-2 px-6 py-2 border border-green-600 text-green-700 rounded-lg font-bold hover:bg-green-50 transition-colors"
              >
                <CalendarPlus className="w-5 h-5" />
                Simpan ke Kalender
              </button>
              <button
                onClick={handleRegister}
                className="px-10 py-2 bg-[#2563eb] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
