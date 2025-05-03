"use client"; // Required for Next.js 13+ (app directory)

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArchive } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const LatestUpdate = ({ latest_update }) => {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-[#bb5052]">Latest Updates</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {latest_update.map((item, index) => (
          <div
            key={index}
            className="bg-[#191919] p-4 rounded-lg flex shadow-lg hover:shadow-xl transition-all"
          >
            {/* Manga Image */}
            <div className="w-32 flex-shrink-0">
              <img
                className="w-full h-full object-cover rounded-md"
                src={item.image_src}
                alt={item.manga_title}
              />
            </div>

            {/* Manga Info */}
            <div className="ml-4 flex flex-col justify-center flex-grow">
              <div>
                <h3 className="text-lg font-semibold hover:text-[#bb5052]">
                  <Link
                    href={`mangadetailpage/${encodeURIComponent(
                      item.manga_title
                    )}`}
                  >
                    {item.manga_title}
                  </Link>
                </h3>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.genres.map((genre, i) => (
                    <Link key={i} href={genre.url}>
                      <span className="cursor-pointer text-xs bg-[rgba(255,255,255,0.2)] px-2 py-1 rounded-full hover:text-white hover:bg-[#bb5052] transition-colors">
                        {genre.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Chapters */}
              <div className="mt-4">
                {item.chapters.map((chapter, i) => (
                  <div key={i} className="flex flex-col">
                    <Link
                      href={`http://localhost:3000/read/${
                        chapter.url.split("/title/")[1]
                      }`}
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-[#bb5052] hover:text-[#D46A6C] transition-colors"
                    >
                      <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
                      {chapter.name}
                    </Link>
                    {i !== item.chapters.length - 1 && (
                      <hr className="my-2 border-[#505050]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestUpdate;
