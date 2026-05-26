"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/organism/Header";
import { 
  CheckCircle2, 
  Calendar, 
  GraduationCap, 
  CircleDollarSign,
  ChevronLeft,
  Share2,
  Bookmark,
  ExternalLink
} from "lucide-react";
import { eventsData } from "@/lib/eventsData";

const imgCoin = "https://www.figma.com/api/mcp/asset/e2831db7-c4f9-4a87-8496-31ceb6bc1071";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Find the event by ID
  const event = eventsData.find((e) => e.id === id);

  if (!event) {
    return (
      <main className="min-h-screen bg-white pt-[100px] pb-20 px-4 md:px-10">
        <Header />
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-2xl font-bold">Acara tidak ditemukan</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline mt-4 block">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-[100px] pb-20 px-4 md:px-10">
      <Header />
      
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb / Back Button */}
        <Link href="/dashboard" className="flex items-center gap-2 text-[#2563eb] font-semibold mb-8 hover:underline">
          <ChevronLeft className="w-5 h-5" />
          Kembali ke Beranda
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Event Poster */}
          <div className="w-full lg:w-[403px] shrink-0">
            <div className="relative w-full aspect-[403/537] rounded-[20px] overflow-hidden shadow-lg bg-gray-100">
              <Image 
                src={event.image} 
                alt={event.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column: Event Info */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Title and Verification */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-[32px] font-bold text-[#161616] leading-tight">
                  {event.title} {event.year}
                </h1>
                {event.isVerified && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#2563eb]" />
                    <span className="text-[18px] font-bold text-[#2563eb]">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {event.category && (
                  <span className="px-4 py-1 bg-[#eaf6ff] border border-black/10 rounded-full text-[13px] font-semibold">
                    {event.category}
                  </span>
                )}
              </div>
            </div>

            <hr className="border-black/10" />

            {/* Event Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-bold text-[#161616]">Jenjang Pendidikan</span>
                <div className="flex items-center gap-2 text-[#777]">
                  <GraduationCap className="w-6 h-6 text-[#2563eb]" />
                  <span className="text-[13px] font-medium">{event.tags.join(", ")}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-bold text-[#161616]">Mulai Pendaftaran</span>
                <div className="flex items-center gap-2 text-[#777]">
                  <Calendar className="w-6 h-6 text-[#2563eb]" />
                  <span className="text-[13px] font-medium">{event.startDate}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-bold text-[#161616]">Penutupan Pendaftaran</span>
                <div className="flex items-center gap-2 text-[#e53835]">
                  <Calendar className="w-6 h-6" />
                  <span className="text-[13px] font-medium font-bold">{event.deadline}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-bold text-[#161616]">Pembayaran</span>
                <div className="flex items-center gap-2 text-[#0e0e0f]">
                  <div className="relative w-6 h-6">
                     <Image src={imgCoin} alt="coin" fill className="object-contain" />
                  </div>
                  <span className="text-[13px] font-medium">{event.price}</span>
                </div>
              </div>
            </div>

            <hr className="border-black/10" />

            {/* Organizer Section */}
            <div className="flex items-center gap-4">
              <div className="w-[63px] h-[69px] relative bg-gray-50 rounded overflow-hidden">
                {event.organizerLogo && (
                  <Image 
                    src={event.organizerLogo} 
                    alt={event.organizer} 
                    fill 
                    className="object-contain" 
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-[#bababa]">Diselenggarakan Oleh</span>
                <span className="text-[20px] font-bold text-black">{event.organizer}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="flex flex-col gap-3 mt-4">
              <h2 className="text-[20px] font-bold text-black">Deskripsi</h2>
              <p className="text-[16px] text-[#777] leading-[1.6] text-justify">
                {event.description}
              </p>
            </div>

            {/* Requirements Section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-[20px] font-bold text-black">Persyaratan dan Ketentuan</h2>
              <div className="flex rounded-[20px] overflow-hidden shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)]">
                <div className="w-[158px] bg-[#23458f4d] flex items-center justify-center p-4">
                   <span className="text-[16px] font-bold text-black">Lainnya</span>
                </div>
                <div className="flex-1 bg-[#acbde34d] p-6">
                  <p className="text-[16px] text-black font-bold mb-2">Persyaratan pendaftaran:</p>
                  <ol className="list-decimal list-inside text-[16px] text-[#777] space-y-1 text-justify">
                    {event.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Booklet Link */}
            <div className="flex rounded-[20px] overflow-hidden shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)] h-[58px]">
              <div className="w-[158px] bg-[#23458f4d] flex items-center justify-center">
                 <span className="text-[16px] font-bold text-black">Booklet</span>
              </div>
              <div className="flex-1 bg-[#acbde34d] flex items-center justify-between px-6">
                <span className="text-[16px] text-[#777]">Panduan Pendaftaran</span>
                <ExternalLink className="w-5 h-5 text-[#777]" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8 self-end">
              <button className="flex items-center gap-2 px-6 py-2 border border-[#2563eb] text-[#2563eb] rounded-lg font-bold hover:bg-blue-50 transition-colors">
                <Bookmark className="w-5 h-5" />
                Bookmark
              </button>
              <button className="flex items-center gap-2 px-6 py-2 border border-[#2563eb] text-[#2563eb] rounded-lg font-bold hover:bg-blue-50 transition-colors">
                <Share2 className="w-5 h-5" />
                Bagikan
              </button>
              <button className="px-10 py-2 bg-[#2563eb] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
