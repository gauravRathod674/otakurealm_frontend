"use client";
import { useState } from "react";
import Link from "next/link";

/**
 * Example color palette: 7 text-colors that cycle for each genre name.
 * Adjust these classes or the palette as needed.
 */
const colorPalette = [
  "text-green-400",
  "text-red-400",
  "text-blue-400",
  "text-orange-400",
  "text-pink-400",
  "text-purple-400",
  "text-yellow-400",
];

export default function Genres({ genres = [] }) {
  const [showCount, setShowCount] = useState(24);

  // If no genres were provided
  if (!genres.length) {
    return (
      <div className="bg-[#191919] p-4 rounded-md">
        <h2 className="text-xl font-bold text-[#BB5052] mb-4">Genres</h2>
        <p className="text-gray-300">No genres found.</p>
      </div>
    );
  }

  // Slice the array to only show up to showCount
  const visibleGenres = genres.slice(0, showCount);

  const handleShowMore = () => {
    setShowCount(genres.length); // Show all remaining genres
  };

  return (
    <div className="genres">
        <h2 className="text-2xl font-bold text-[#BB5052] mb-4">Genres</h2>
        <div className="bg-[#191919] p-4 rounded-md">
      {/* Use a grid with 1 column on mobile, 2 columns on small screens, and 3 columns on medium+ screens */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-3">
        {visibleGenres.map((genre, index) => {
          // Cycle through the 7 color classes
          const colorClass = colorPalette[index % colorPalette.length];

          return (
            <Link
              key={genre.url}
              href={`manga${genre.url}`}
              className={`${colorClass} text-sm font-semibold hover:underline`}
            >
              {genre.name}
            </Link>
          );
        })}
      </div>

      {/* Show more button if there are still hidden genres */}
      {genres.length > showCount && (
        <button
          onClick={handleShowMore}
          className="mt-4 block w-full text-center text-black font-bold bg-[#bb5052] py-2 rounded-md hover:bg-[#A04345] transition-colors"
        >
          Show more
        </button>
      )}
    </div>
    </div>
  
  );
}
