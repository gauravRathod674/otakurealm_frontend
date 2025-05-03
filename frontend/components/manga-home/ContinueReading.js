"use client";

import Link from "next/link";
import Image from "next/image";

export default function ContinueReading({ continueReadingData }) {
  if (!continueReadingData || continueReadingData.length === 0) return null;

  return (
    <section className="mt-10 mb-10 ml-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#bb5052]">Continue Reading</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {continueReadingData.map((entry) => (
          <div key={entry.id} className="relative w-[90%] h-83 rounded-md overflow-hidden group">
            <Link href={entry.read_url || "#"} className="block w-full h-full">
              <CardContent entry={entry} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function CardContent({ entry }) {
  const dateObj = new Date(entry.updated_at);
  const dateStr = dateObj.toLocaleDateString();
  const timeStr = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const progressPercent = Math.min(
    100,
    Math.floor((entry.last_read_page / entry.total_pages) * 100)
  );

  return (
    <>
      {/* Image section: 75% normally, 70% on very small screens */}
      <div className="relative w-full h-[75%] max-[500px]:h-[70%]">
        <Image
          src={entry.cover_image_url || "/default-cover.jpg"}
          alt={entry.manga_title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={500}
          height={750}
          quality={85}
        />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />

        {/* Genres: up to 3 normally, hide the 3rd on screens <=1300px */}
        {entry.genres?.length > 0 && (
          <div className="absolute bottom-6 left-0 w-full z-20 px-2 flex flex-col gap-1">
            <div className="flex flex-wrap justify-center gap-1">
              {entry.genres.slice(0, 3).map((genre, idx) => (
                <span
                  key={`genre-${idx}`}
                  className={`inline-block text-xs text-white px-2 py-0.5 rounded bg-[rgba(255,255,255,0.1)] ${idx >= 2 ? 'max-[1300px]:hidden' : ''}`}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
          <div
            className="h-full bg-[#bb5052] transition-all"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Content section: 25% normally, 30% on very small screens */}
      <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white flex flex-col justify-center max-[500px]:h-[30%]">
        <h3 className="font-semibold text-base leading-tight line-clamp-2 max-[1300px]:line-clamp-1 text-center">
          <div>{entry.manga_title.replace(/\b\w/g, (c) => c.toUpperCase())}</div>
        </h3>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-1">
          <div className="text-center">
            <div>{entry.chapter_name.replace(/\b\w/g, (c) => c.toUpperCase())}</div>
          </div>
          <span className="text-gray-500">|</span>
          <div className="flex flex-col items-center">
            <span>{dateStr}</span>
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </>
  );
}
