"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faGlasses,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

const MangaImageSlider = ({ sliderData = [] }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const pathname = usePathname();
  const lastPart = pathname.split("/").pop();

  const changeSlide = (newIndex) => {
    if (newIndex < 0) {
      setSlideIndex(sliderData.length - 1);
    } else if (newIndex >= sliderData.length) {
      setSlideIndex(0);
    } else {
      setSlideIndex(newIndex);
    }
  };

  useEffect(() => {
    setSlideIndex(0);
  }, [lastPart]);

  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide(slideIndex + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideIndex]);

  if (!sliderData.length) return null;

  return (
    <div className="relative flex w-full h-[70vh] max-[768px]:h-[50vh] overflow-hidden bg-black text-white">
      {sliderData.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            slideIndex === index ? "opacity-100 z-10" : "opacity-0 -z-10"
          }`}
        >
          {/* Background Blur */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={item.image_src}
              alt={item.manga_title}
              layout="fill"
              objectFit="cover"
              className="opacity-40 blur-md max-[768px]:blur-sm"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 w-full h-full flex flex-row max-[768px]:flex-col items-center max-[768px]:items-start max-[768px]:justify-center px-10 max-[768px]:px-4 py-8 max-[768px]:py-6">
            {/* Text Left Side */}
            <div className="w-1/2 max-[768px]:w-full max-w-[600px] pr-4 max-[768px]:pr-0">
              {/* Chapter */}
              <div className="mb-3 text-[#ba574f] text-xl font-bold max-[768px]:text-base max-[768px]:mb-2">
                {item.chapter}
              </div>

              {/* Title */}
              <div className="mb-3 text-4xl font-bold leading-tight max-[768px]:text-2xl max-[768px]:leading-snug">
                {item.manga_title}
              </div>

              {/* Genres (Details Section) */}
              {item.genres && item.genres.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-5 mt-5 max-[768px]:mb-4 max-[768px]:mt-3">
                  {item.genres.map((genre, idx) => (
                    <Link
                      href={`/manga${genre.url}`}
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-transparent border-[1px] text-sm text-white hover:text-[#bb5052] hover:border-[#bb5052]"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="h-20 overflow-hidden mb-4 max-[768px]:h-16 max-[768px]:mb-3">
                <p className="text-base font-light line-clamp-3 max-[768px]:text-sm max-[768px]:line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-1 text-sm font-semibold  max-[640px]:px-5 max-[640px]:py-2 sm:text-base md:text-lg bg-[#ba574f] text-black rounded-full flex items-center gap-2 hover:bg-[#bb5052] transition-all duration-200 max-[640px]:mb-8 min-[900px]:mt-7 min-[900px]:py-2 ">
                  <span className="font-bold mr-2">
                    <FontAwesomeIcon icon={faGlasses} />
                  </span>
                  <Link href={`/read/${encodeURIComponent(item.manga_title)}`}>
                    Read now
                  </Link>
                </button>
                <button className="px-4 py-1 text-sm font-semibold  max-[640px]:px-5 max-[640px]:py-2 sm:text-base md:text-lg bg-[rgba(255,255,255,0.2)] text-white rounded-full flex items-center gap-2 hover:bg-[rgba(255,255,255,0.3)] transition-all duration-200 max-[640px]:mb-8  min-[900px]:mt-7 min-[900px]:py-2 ">
                  <Link
                    href={`/mangadetailpage/${encodeURIComponent(
                      item.manga_title
                    )}`}
                  >
                    Details
                  </Link>
                  <span className="font-bold">
                    <FontAwesomeIcon icon={faAngleRight} />
                  </span>
                </button>
              </div>
            </div>

            {/* Right Image (hide on mobile) */}
            <div className="w-1/2 flex justify-center items-center max-[768px]:hidden">
              <div className="relative md:w-[350px] md:h-[500px] transform rotate-7 border-15 shadow-xl">
                <Image
                  src={item.image_src}
                  alt={item.manga_title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons (desktop only) */}
      <button
        className="hidden md:block absolute bottom-2 right-5 text-white bg-[rgba(255,255,255,0.1)] w-10 h-10 rounded-md flex items-center justify-center z-30 hover:bg-[#ba574f]"
        onClick={() => changeSlide(slideIndex - 1)}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button
        className="hidden md:block absolute bottom-14 right-5 text-white bg-[rgba(255,255,255,0.1)] w-10 h-10 rounded-md flex items-center justify-center z-30 hover:bg-[#ba574f]"
        onClick={() => changeSlide(slideIndex + 1)}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>

      {/* Mobile Dot Nav */}
      <div className="md:hidden absolute top-1/2 right-4 -translate-y-1/2 z-30 flex flex-col">
        {sliderData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => changeSlide(idx)}
            className={`w-3 h-3 rounded-full my-1 transition-colors ${
              slideIndex === idx
                ? "bg-[#ba574f] opacity-100"
                : "bg-[rgba(255,255,255,0.1)] opacity-70 hover:opacity-100"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default MangaImageSlider;
