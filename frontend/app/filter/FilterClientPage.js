'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilterContainer from "@/components/FilterContainer";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faMicrophone } from "@fortawesome/free-solid-svg-icons";


export default function FilterClientPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const appliedFilters = searchParams.get("filters") || null;

  // Local states
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Maximum number of cards per page
  const PAGE_SIZE = 24;

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);

    const params = new URLSearchParams();
    params.append("anime_title", keyword);
    if (appliedFilters) {
      params.append("applied_filters", appliedFilters);
    }

    // Pass the page number & limit (24) to the backend
    params.append("page", currentPage);
    params.append("limit", PAGE_SIZE);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/scrape/search?${params.toString()}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setSearchData(data);

        // Use "last_page" from the backend to set totalPages
        if (data.last_page) {
          setTotalPages(data.last_page);
        } else {
          setTotalPages(1);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching search data:", err);
        setLoading(false);
      });
  }, [keyword, appliedFilters, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!searchData) return <div className="p-4">No results found.</div>;

  // Ensure only PAGE_SIZE number of cards are displayed per page.
  const allCards = searchData.cards || [];
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const displayedCards = allCards.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="container mx-auto p-4">
      <FilterContainer />

      {/* CARDS CONTAINER */}
      <div className="cards p-5 pl-20 pr-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedCards.map((anime, idx) => (
            <Link
              key={idx}
              href={`/animedetailpage${anime.url}`}
              className="relative w-full h-80 rounded-md overflow-hidden group"
            >
              {/* Top 75% (Image + gradient + badges) */}
              <div className="relative w-full h-[75%]">
                <img
                  src={anime.poster_url}
                  alt={anime.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />

                {/* Badges row near the bottom of the image */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center flex-wrap gap-[2px] z-10 text-white">
                  {anime.sub && (
                    <span className="px-1 py-0.5 bg-green-300 text-black border-l border-white/10 flex items-center rounded-l-md text-xs font-bold">
                      <FontAwesomeIcon
                        icon={faClosedCaptioning}
                        className="mr-1"
                      />
                      {anime.sub}
                    </span>
                  )}

                  {anime.dub && (
                    <span className="px-1 py-0.5 bg-pink-300 text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold">
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className="mr-1"
                      />
                      {anime.dub}
                    </span>
                  )}

                  <span className="mx-2 text-base">•</span>
                  <span>{anime.type}</span>
                </div>
              </div>

              {/* Bottom 25% (Title + type/runtime) */}
              <div className="relative w-full h-[20%] bg-[#191919] px-2 py-2 text-white flex justify-center items-center">
                <h3 className="font-semibold text-base leading-tight line-clamp-2 text-center">
                  {anime.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* PAGINATION CONTAINER */}
      <div className="flex justify-center mt-6">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

/**
 * A pagination component that:
 * - Hides First/Prev if on page 1
 * - Hides Next/Last if on the final page
 * - If totalPages <= 6, shows all pages
 * - If totalPages > 6, shows pages 1..5, then "..." then last page
 * - Active page has a distinct style (red border here).
 */
function CustomPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goToPage = (page) => onPageChange(page);
  const goToFirst = () => onPageChange(1);
  const goToLast = () => onPageChange(totalPages);
  const goToPrev = () => onPageChange(currentPage - 1);
  const goToNext = () => onPageChange(currentPage + 1);

  let pagesToShow = [];
  if (totalPages <= 6) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // Show pages 1 to 5, then "..." and finally the last page,
    // but only if last page is not already within the first 5 pages.
    pagesToShow = [1, 2, 3, 4, 5, "...", totalPages];
  }

  return (
    <nav className="flex items-center space-x-1">
      {currentPage > 1 && (
        <>
          <button
            className="px-3 py-1 border border-[#353535] text-white hover:bg-[#bb5052] hover:border-[#bb5052]"
            onClick={goToFirst}
          >
            «
          </button>
          <button
            className="px-3 py-1 border border-[#353535] text-white  hover:bg-[#bb5052] hover:border-[#bb5052]"
            onClick={goToPrev}
          >
            ‹
          </button>
        </>
      )}

      {pagesToShow.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-1 text-white border border-[#353535]   hover:bg-[#bb5052] hover:border-[#bb5052]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 border  hover:bg-[#bb5052] hover:border-[#bb5052] ${
              page === currentPage
                ? "border-[#bb5053] text-white"
                : "border-[#353535] text-white"
            }`}
          >
            {page}
          </button>
        )
      )}

      {currentPage < totalPages && (
        <>
          <button
            className="px-3 py-1 border border-[#353535] text-white hover:bg-[#bb5052] hover:border-[#bb5052]"
            onClick={goToNext}
          >
            ›
          </button>
          <button
            className="px-3 py-1 border border-[#353535] text-white  hover:bg-[#bb5052] hover:border-[#bb5052]"
            onClick={goToLast}
          >
            »
          </button>
        </>
      )}
    </nav>
  );
}
