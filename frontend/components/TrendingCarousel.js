"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { faGreaterThan, faLessThan } from "@fortawesome/free-solid-svg-icons";

export default function TrendingSection({ trendingData = [] }) {
  const [startIndex, setStartIndex] = useState(0);
  const [cols, setCols] = useState(1);
  const [rows, setRows] = useState(1);

  // Fixed dimensions
  const cardWidth = 220;
  const cardHeight = 250;
  const gap = 15;
  const buttonWidth = 40;

  // Declare once here
  const [buttonHeight, setButtonHeight] = useState(cardHeight - gap);

  // Determine cols/rows per breakpoint
  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      let c = 1,
        r = 1;

      if (w <= 592) {
        c = 1;
        r = 2; // Mobile: 1 col x 2 rows
      } else if (w <= 848) {
        c = 2;
        r = 2; // Small tablets: 2 x 2
      } else if (w <= 1024) {
        c = 3;
        r = 2; // Tablet landscape: 3 x 2
      } else if (w <= 1440) {
        c = 4;
        r = 1; // Laptop: 4 x 1
        let newButtonHeight = cardHeight / 2 - gap;
        setButtonHeight(newButtonHeight);
        console.log("In side useEffect = ", newButtonHeight);
      } else {
        c = 6;
        r = 1; // Desktop: 6 x 1
        let newButtonHeight = cardHeight / 2 - gap;
        setButtonHeight(newButtonHeight);
        console.log("In side useEffect = ", newButtonHeight);
      }

      setCols(c);
      setRows(r);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  console.log("Outside useeffect = ", buttonHeight);

  const cardsPerPage = cols * rows;
  const maxStart = Math.max(0, trendingData.length - cardsPerPage);

  const handlePrev = () => setStartIndex((i) => Math.max(0, i - cardsPerPage));
  const handleNext = () =>
    setStartIndex((i) => Math.min(maxStart, i + cardsPerPage));

  const visibleItems = trendingData.slice(
    startIndex,
    startIndex + cardsPerPage
  );
  const truncate = (t) => (t?.length > 17 ? t.slice(0, 17) + "..." : t || "");

  // Grid template: cols cards + nav column
  const columnsStyle = `repeat(${cols}, ${cardWidth}px) ${buttonWidth}px`;
  const rowsStyle = `repeat(${rows}, ${cardHeight}px)`;

  return (
    <div className="trending-section my-8 overflow-hidden">
      <h2 className="text-2xl font-bold text-[#bb5052] mb-4 ml-2">Trending</h2>

      <div
        className="inline-block p-3 rounded-md"
        style={{ backgroundColor: "#000" }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: columnsStyle,
            gridTemplateRows: rowsStyle,
            columnGap: `${gap}px`,
            rowGap: `${gap}px`,
          }}
        >
          {/* Cards */}
          {visibleItems.map((item) => (
            <div
              key={item.number}
              className="relative rounded-md overflow-hidden"
              style={{
                width: cardWidth,
                height: cardHeight,
                backgroundColor: "#191919",
              }}
            >
              <div
                className="absolute top-0 left-0 h-full flex flex-col items-center justify-center text-white"
                style={{ width: "15%" }}
              >
                <div className="text-[#bb5052] text-2xl font-bold absolute bottom-0">
                  {item.number}
                </div>
                <div
                  className="-rotate-90 text-xs font-medium whitespace-nowrap"
                  style={{ width: "max-content" }}
                >
                  {truncate(item.title)}
                </div>
              </div>
              <div
                className="absolute top-0 right-0 h-full"
                style={{ width: "85%" }}
              >
                <Link href={`animedetailpage${item.url}`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={item.poster}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>
              </div>
            </div>
          ))}
          {rows > 1 ? (
            <>
              {/* Next Button - Top */}
              <button
                onClick={handleNext}
                disabled={startIndex + cardsPerPage >= trendingData.length}
                className="w-full flex items-center justify-center rounded-md"
                style={{
                  gridColumn: cols + 1,
                  gridRow: 1,
                  width: buttonWidth,
                  height: buttonHeight,
                  backgroundColor: "#353535",
                  color: "#fff",
                  cursor:
                    startIndex + cardsPerPage < trendingData.length
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <FontAwesomeIcon icon={faGreaterThan} />
              </button>

              {/* Prev Button - Bottom */}
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="w-full flex items-center justify-center rounded-md"
                style={{
                  gridColumn: cols + 1,
                  gridRow: rows,
                  width: buttonWidth,
                  height: buttonHeight,
                  backgroundColor: "#353535",
                  color: "#fff",
                  cursor: startIndex > 0 ? "pointer" : "not-allowed",
                }}
              >
                <FontAwesomeIcon icon={faLessThan} />
              </button>
            </>
          ) : (
            // For 1-row layout: stack both buttons vertically
            <div
              style={{
                gridColumn: cols + 1,
                gridRow: 1,
                height: cardHeight,
                width: buttonWidth,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: `${gap}px`,
              }}
            >
              <button
                onClick={handleNext}
                disabled={startIndex + cardsPerPage >= trendingData.length}
                className="w-full flex-1 flex items-center justify-center rounded-md"
                style={{
                  backgroundColor: "#353535",
                  color: "#fff",
                  cursor:
                    startIndex + cardsPerPage < trendingData.length
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <FontAwesomeIcon icon={faGreaterThan} />
              </button>
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="w-full flex-1 flex items-center justify-center rounded-md"
                style={{
                  backgroundColor: "#353535",
                  color: "#fff",
                  cursor: startIndex > 0 ? "pointer" : "not-allowed",
                }}
              >
                <FontAwesomeIcon icon={faLessThan} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
