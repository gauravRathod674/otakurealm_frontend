"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {
  faGreaterThan,
  faLessThan,
  faStar,
  faGlobe,
  faFileAlt,
  faGlasses,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function TrendingSection({ trendingData = [] }) {
  const [startIndex, setStartIndex] = useState(0);
  const [cols, setCols] = useState(1);
  const [rows, setRows] = useState(1);

  const cardWidth = 220;
  const cardHeight = 250;
  const gap = 15;
  const buttonWidth = 40;
  const [buttonHeight, setButtonHeight] = useState(cardHeight - gap);

  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      let c = 1,
        r = 1;

      if (w <= 592) {
        c = 1;
        r = 2;
      } else if (w <= 848) {
        c = 2;
        r = 2;
      } else if (w <= 1024) {
        c = 3;
        r = 2;
      } else if (w <= 1440) {
        c = 4;
        r = 1;
        setButtonHeight(cardHeight / 2 - gap);
      } else {
        c = 6;
        r = 1;
        setButtonHeight(cardHeight / 2 - gap);
      }

      setCols(c);
      setRows(r);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

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

  const columnsStyle = `repeat(${cols}, ${cardWidth}px) ${buttonWidth}px`;
  const rowsStyle = `repeat(${rows}, ${cardHeight}px)`;

  return (
    <div className="trending-section my-8 overflow-hidden">
      <h2 className="text-2xl font-bold text-[#bb5052] mb-4 ml-2">Trending</h2>

      <div className="inline-block p-3 rounded-md" style={{ backgroundColor: "#000" }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: columnsStyle,
            gridTemplateRows: rowsStyle,
            columnGap: `${gap}px`,
            rowGap: `${gap}px`,
          }}
        >
          {visibleItems.map((item) => (
            <div
              key={item.card_no}
              className="relative group cursor-pointer"
              style={{
                width: cardWidth,
                height: cardHeight,
                background: "linear-gradient(to top, #191919, #404040)",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div
                className="absolute top-0 left-0 h-full flex flex-col items-center justify-center text-white"
                style={{ width: "15%" }}
              >
                <div className="text-[#bb5052] text-2xl font-bold absolute bottom-0 mb-2">
                  {item.card_no < 10 ? `0${item.card_no}` : item.card_no}
                </div>
                <div
                  className="-rotate-90 text-sm font-medium whitespace-nowrap"
                  style={{ width: "max-content" }}
                >
                  {truncate(item.manga_title)}
                </div>
              </div>

              <div
                className="absolute top-0 right-0 h-full"
                style={{ width: "85%" }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.image_src}
                    alt={item.manga_title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300 group-hover:opacity-0"
                  />

                  <div className="absolute inset-0 w-full h-full z-10 bg-[#191919] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-3 w-full h-full flex flex-col">
                      <div className="mb-2" style={{ height: "70%" }}>
                        <div className="text-sm font-semibold mb-1 line-clamp-3">
                          {item.manga_title}
                        </div>

                        <div className="flex items-center text-sm mb-1">
                          <FontAwesomeIcon icon={faStar} className="mr-2" />
                          {item.rating}
                        </div>

                        <div className="flex items-center text-sm mb-1">
                          <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                          EN
                        </div>

                        <div className="flex items-center text-sm">
                          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                          {item.chapter}
                        </div>
                      </div>

                      <div
                        className="flex flex-col justify-between"
                        style={{ height: "30%" }}
                      >
                        <div>
                          <Link
                            href={`/read/${encodeURIComponent(
                              item.manga_title
                            )}`}
                          >
                            <button className="bg-[#bb5052] text-black text-sm py-1 px-2 rounded w-full transition-transform duration-300 hover:scale-105">
                              <FontAwesomeIcon
                                icon={faGlasses}
                                className="mr-2"
                              />
                              Read Now
                            </button>
                          </Link>
                        </div>
                        <div>
                          <Link
                            href={`/mangadetailpage/${encodeURIComponent(
                              item.manga_title
                            )}`}
                          >
                            <button className="bg-[rgba(255,255,255,0.2)] text-white text-sm py-1 px-2 rounded w-full transition-transform duration-300 hover:scale-105">
                              <FontAwesomeIcon
                                icon={faInfoCircle}
                                className="mr-2"
                              />
                              Info
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {rows > 1 ? (
            <>
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
