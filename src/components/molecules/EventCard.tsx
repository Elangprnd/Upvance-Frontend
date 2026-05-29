"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CheckCircle2, Globe, Calendar, ChevronRight } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  location: string;
  startDate: string;
  deadline: string;
  price: string;
  image: string;
  isVerified?: boolean;
  category?: string;
  isOnline?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Lomba: "bg-blue-600",
  Seminar: "bg-purple-600",
  Workshop: "bg-orange-500",
  Beasiswa: "bg-green-600",
  Magang: "bg-teal-600",
  Webinar: "bg-indigo-600",
  Volunteer: "bg-lime-600",
  Greenvity: "bg-emerald-700",
  Lainnya: "bg-gray-500",
};

export default function EventCard({
  id,
  title,
  location,
  startDate,
  deadline,
  price,
  image,
  isVerified = false,
  category = "Lainnya",
  isOnline = false,
}: EventCardProps) {
  const catColor = CATEGORY_COLORS[category] ?? "bg-gray-500";

  return (
    <Link href={`/events/${id}`} className="block group">
      <div className="relative w-[306px] rounded-[20px] overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.12)] group-hover:shadow-[0px_8px_32px_rgba(37,99,235,0.25)] group-hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col">
        
        {/* Image Section */}
        <div className="relative w-full h-[200px] overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="306px"
          />
          {/* Gradient overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Category badge — top left */}
          <span className={`absolute top-3 left-3 ${catColor} text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md`}>
            {category}
          </span>

          {/* Verified badge — top right */}
          {isVerified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#2563eb] text-[11px] font-bold px-2 py-1 rounded-full shadow">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </div>
          )}

          {/* Price — bottom left overlay */}
          <div className="absolute bottom-3 left-3">
            <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${
              price === "Gratis"
                ? "bg-green-500 text-white"
                : "bg-yellow-400 text-black"
            }`}>
              {price}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 py-4 flex flex-col gap-3 flex-1">
          {/* Title */}
          <h3 className="text-[15px] font-bold text-[#161616] leading-tight line-clamp-2 min-h-[40px]">
            {title}
          </h3>

          {/* Info rows */}
          <div className="flex flex-col gap-2">
            {/* Location */}
            <div className="flex items-center gap-2 text-[#555]">
              {isOnline ? (
                <Globe className="w-4 h-4 text-[#2563eb] shrink-0" />
              ) : (
                <MapPin className="w-4 h-4 text-[#2563eb] shrink-0" />
              )}
              <span className="text-[12px] font-medium truncate">
                {isOnline ? "Online" : location}
              </span>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2 text-[#555]">
              <Calendar className="w-4 h-4 text-[#2563eb] shrink-0" />
              <span className="text-[12px] font-medium">Mulai: {startDate}</span>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <span className="text-[11px] text-[#dc2626] font-bold">
              ⏰ Deadline: {deadline}
            </span>
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563eb] group-hover:bg-blue-700 rounded-[10px] text-white text-[13px] font-bold transition-colors mt-1">
            <span>Lihat Detail</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
