"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CheckCircle2, CircleDollarSign, ChevronRight, Heart } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  year?: string;
  location: string;
  startDate: string;
  deadline: string;
  price: string;
  organizer: string;
  image: string;
  organizerLogo?: string;
  isVerified?: boolean;
  tags?: string[];
  category?: string;
}


export default function EventCard({
  id,
  title,
  year,
  location,
  startDate,
  deadline,
  price,
  organizer,
  image,
  organizerLogo,
  isVerified = true,
  tags = ["D1", "D2", "D3", "S1"],
  category = "Tingkat Nasional",
}: EventCardProps) {
  return (
    <div className="bg-white rounded-[20px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.25)] overflow-hidden w-[306px] h-[616px] flex flex-col relative group">
      {/* Event Image */}
      <div className="relative w-[271px] h-[361px] mx-auto mt-[18px] rounded-[20px] overflow-hidden bg-gray-200">
        <Image src={image} alt={title} fill className="object-cover" sizes="271px" />
        
        {/* Tags Overlay */}
        <div className="absolute top-2 left-2 flex gap-1">
          {tags.map((tag) => (
            <div
              key={tag}
              className="w-[21px] h-[21px] bg-[#1eba5d] rounded-full flex items-center justify-center shadow-sm"
            >
              <span className="text-white text-[9px] font-light">{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-3 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-[14px] font-bold text-[#161616] leading-[17.5px] h-[35px] line-clamp-2 mb-4">
          {title} {year}
        </h3>

        {/* More Detail Button */}
        <Link href={`/events/${id}`} className="w-full">
          <button className="w-full h-[36px] bg-[#2563eb] rounded-[50px] text-white flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors mb-4">
            <span className="text-[18px] font-bold">More Detail</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </Link>

        {/* Details Row 1 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <div className="relative w-[10.5px] h-[10.5px]">
               <MapPin className="w-[10.5px] h-[10.5px] text-[#374151]" />
            </div>
            <span className="text-[10.5px] font-bold text-[#374151]">{location}</span>
          </div>
          {isVerified && (
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-bold text-[#2563eb]">Verified</span>
              <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
            </div>
          )}
        </div>

        {/* Details Row 2 */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10.5px] font-bold text-[#161616]">Mulai: {startDate}</span>
          <span className="text-[10.5px] font-bold text-black">{category}</span>
        </div>

        {/* Price & Deadline */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <CircleDollarSign className="w-[16px] h-[16px] text-[#2563eb]" />
            <span className="text-[10px] font-bold text-[#0e0e0f]">{price}</span>
          </div>
          <span className="text-[10.5px] font-bold text-[#dc2626]">Deadline: {deadline}</span>
        </div>

        {/* Divider */}
        <div className="h-[0.5px] bg-[#bababa] w-full mb-3" />

        {/* Organizer */}
        <div className="flex items-center gap-3 relative">
          <div className="w-[49px] h-[54px] relative bg-gray-100 rounded overflow-hidden">
            {organizerLogo && (
              <Image src={organizerLogo} alt={organizer} fill className="object-contain" sizes="49px" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#bababa]">Diselenggarakan Oleh</span>
            <span className="text-[12px] font-bold text-black line-clamp-2 leading-[14px]">{organizer}</span>
          </div>

          {/* Like Button */}
          <button className="absolute right-0 bottom-0 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <Heart className="w-[21px] h-[21px] text-[#bababa]" />
          </button>
        </div>
      </div>
    </div>
  );
}
