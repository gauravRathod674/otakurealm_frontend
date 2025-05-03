"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faPlus,
  faPlay,
  faGreaterThan,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AnimeDetail() {
  const [animeDetail, setAnimeDetail] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCount, setShowCount] = useState(5);
  const [isClient, setIsClient] = useState(false);

  const pathname = usePathname();
  const lastPart = pathname.split("/").pop();
  const { slug } = useParams();
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ This useEffect can remain if you plan to do something with lastPart later
  useEffect(() => {
    console.log("lastPart changed:", lastPart);
  }, [lastPart]);

  // ✅ Use lastPart in the second useEffect instead of slug
  useEffect(() => {
    if (lastPart) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/scrape/kaido-detail`, {
          params: { pathname: `/${lastPart}` }, // Correct param
        })
        .then((response) => {
          setAnimeDetail(response.data);
        })
        .catch((error) => {
          console.error("Error fetching anime detail:", error);
        });
    }
  }, [lastPart]); // ✅ Correct dependency
  if (!animeDetail) return <div>Loading...</div>;

  const description = animeDetail.description || "";
  const truncateLength = 262;
  const truncatedDesc =
    description.length > truncateLength
      ? description.slice(0, truncateLength) + "..."
      : description;

  // Helper to preserve <br> tags
  const renderDescriptionAsParagraphs = (desc) => {
    const paragraphs = desc.split(/<br\s*\/?>/i);
    return paragraphs.map((para, idx) => (
      <p
        key={idx}
        className="text-gray-200 leading-relaxed mb-0"
        style={{ display: "inline" }}
      >
        {para.trim()}
        {idx < paragraphs.length - 1 && <br />}
      </p>
    ));
  };

  return (
    <div className="anime-detail-page relative w-full min-h-screen text-white overflow-hidden mt-10">
      {/* Main container wrapper with background */}
      <div className="main-container relative w-full">
        {/* Background & overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${animeDetail.background})`,
              opacity: 0.6,
            }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[40px]" />
        </div>

        {/* Responsive flex layout */}
        <div className="relative z-10 w-full flex flex-col xl:flex-row items-stretch gap-3 min-h-[70vh] overflow-hidden px-4 py-10 ml-5">
          {/* Top: Left + Center columns container */}
          <div className="flex flex-col max-[640px]:items-center sm:flex-row w-full xl:w-[75%] gap-3">
            {/* Left Column */}
            <div className="w-full sm:w-[30%] xl:w-[15%] flex-shrink-0 mt-10 max-[640px]:w-[129px] max-[640px]:h-[192px]">
              <Image
                src={animeDetail.poster}
                alt={animeDetail.title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto rounded-md shadow-lg"
              />
            </div>

            {/* Center Column */}
            <div className="w-full sm:w-[70%] xl:w-[75%] flex flex-col max-[640px]:items-center space-y-4 mt-10 ml-0 sm:ml-10">
              {/* Breadcrumbs */}
              <nav className="flex text-gray-300 gap-[3px] max-[640]:hidden">
                <Link href="/">Home</Link>
                <span className="ml-2 mr-2">•</span>
                <Link href={`/${animeDetail.film_stats.type.toLowerCase()}`}>
                  {animeDetail.film_stats.type}
                </Link>
                <span className="ml-2 mr-2">•</span>
                <span>{animeDetail.title}</span>
              </nav>
              <span className="max-[640px]:relative max-[640px]:bottom-5 max-[640px]:flex max-[640px]:flex-col max-[640px]:items-center">
                {/* Title */}
                <h1 className="text-4xl font-bold mb-5 ">
                  {animeDetail.title}
                </h1>

                {/* Film Stats Badges */}
                <div className="flex items-center text-sm flex-wrap mt-2 mb-5 " >
                  <div className="flex items-center gap-[2px]">
                    {animeDetail.film_stats.rating ? (
                      <span className="px-2 py-1 bg-white text-black rounded-l-md font-bold text-xs">
                        {animeDetail.film_stats.rating}
                      </span>
                    ) : (
                      ""
                    )}

                    {animeDetail.film_stats.quality ? (
                      <span className="px-2 py-1 bg-white text-black border-l border-white/10 font-bold text-xs">
                        {animeDetail.film_stats.quality}
                      </span>
                    ) : (
                      ""
                    )}

                    {animeDetail.film_stats.subtitles ? (
                      <span className="px-1 py-1 bg-green-300 text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold">
                        <FontAwesomeIcon
                          icon={faClosedCaptioning}
                          className="mr-1"
                        />
                        {animeDetail.film_stats.subtitles}
                      </span>
                    ) : (
                      ""
                    )}

                    {animeDetail.film_stats.dubbing ? (
                      <span className="px-1 py-1 bg-pink-300 text-black border-l border-white/10 flex items-center gap-1 rounded-r-md text-xs font-bold">
                        <FontAwesomeIcon icon={faMicrophone} className="mr-1" />
                        {animeDetail.film_stats.dubbing}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  {/* Dot + Type + Dot + Runtime */}
                  <span className="mx-3 h-1 w-1 bg-gray-400 rounded-full inline-block" />
                  <span className="py-1 text-white text-base">
                    {animeDetail.film_stats.type}
                  </span>
                  <span className="mx-3 h-1 w-1 bg-gray-400 rounded-full inline-block" />
                  <span className="py-1 text-white text-base">
                    {animeDetail.film_stats.runtime}
                  </span>
                </div>

                {/* Description & OtakuRealm line - hidden on small screens */}

                <div className="hidden sm:inline-block">
                  <div className="inline-block pr-10">
                    {isExpanded
                      ? renderDescriptionAsParagraphs(description)
                      : renderDescriptionAsParagraphs(truncatedDesc)}
                    {description.length > truncateLength && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline text-[#bb5052] cursor-pointer text-sm ml-1"
                      >
                        {isExpanded ? "- Less" : "+ More"}
                      </button>
                    )}
                  </div>
                  <p className="text-gray-200 leading-relaxed mt-4 mb-5">
                    OtakuRealm is the best site to watch {animeDetail.title} SUB
                    online{" "}
                    {animeDetail
                      ? ", or you can even watch " +
                        animeDetail.title +
                        " DUB in HD quality"
                      : " "}
                    . You can also find {animeDetail.studios} anime on
                    OtakuRealm website.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-4">
                  <button className="bg-[#BB5052] hover:bg-[#A04345] text-black px-7 py-2 rounded-full font-semibold">
                    <span className="font-bold mr-2">
                      <FontAwesomeIcon icon={faPlay} />
                    </span>
                    <Link
                      href={`/watch/${slug}/ep-${
                        animeDetail.film_stats.subtitles
                      }?title=${encodeURIComponent(
                        animeDetail.title
                      )}&anime_type=${encodeURIComponent(
                        animeDetail.film_stats.type
                      )}`}
                    >
                      Watch now
                    </Link>
                  </button>
                  <button className="bg-white text-gray-800 px-7 py-2 rounded-full font-semibold hover:bg-gray-200">
                    <span className="font-extrabold mr-2">
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                    <span>Add to List</span>
                  </button>
                </div>
              </span>
            </div>
          </div>

          {/* Right Column - shown below on xl and moved for smaller screens */}
          <div className="w-full xl:w-[25%] bg-white/10 rounded-md p-7 space-y-3 flex flex-col justify-center text-sm mr-5 mt-5 xl:mt-10 max-[640px]:w-[94%] max-[1280px]:w-[97%]">
            <p>
              <strong className="font-bold">Japanese:</strong>{" "}
              {animeDetail.japanese_title}
            </p>
            <p>
              <strong className="font-bold">Synonyms:</strong>{" "}
              {animeDetail.synonyms.join(", ")}
            </p>
            <p>
              <strong className="font-bold">Aired:</strong> {animeDetail.aired}
            </p>
            <p>
              <strong className="font-bold">Premiered:</strong>{" "}
              {animeDetail.premiered}
            </p>
            <p>
              <strong className="font-bold">Duration:</strong>{" "}
              {animeDetail.duration}
            </p>
            <p>
              <strong className="font-bold">Status:</strong>{" "}
              {animeDetail.status}
            </p>
            <p>
              <strong className="font-bold">MAL Score:</strong>{" "}
              {animeDetail.score}
            </p>

            {/* Genres */}
            <div className="w-full">
              <hr className="max-[1280px]:hidden mt-2 mb-2 text-gray-100" />
              <div className="flex items-center flex-wrap gap-2">
                <strong className="font-bold">Genres:</strong>
                {animeDetail.genres.map((genre, idx) => (
                  <Link
                    href={`/genre/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                    key={idx}
                    className="px-3 py-1 rounded-full border border-white/30 text-white text-sm hover:text-[#D46A6C]"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
              <hr className="max-[1280px]:hidden mt-2 mb-2 text-gray-100" />
            </div>

            <p>
              <strong className="font-bold">Studios:</strong>{" "}
              {animeDetail.studios.join(", ")}
            </p>
            <p>
              <strong className="font-bold">Producers:</strong>{" "}
              {animeDetail.producers.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="additional-info-container bg-black p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Block */}
          <div className="md:w-3/4 p-4 rounded-md">
            {animeDetail.more_seasons && animeDetail.more_seasons.length > 0 ? (
              <section className="more_seasons-wrapper mt-8">
                {/* More Seasons */}
                <h2 className="text-2xl font-bold mb-6 text-[#BB5052]">
                  More Seasons
                </h2>
                {/* Grid of season items */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ">
                  {animeDetail.more_seasons?.map((season) => (
                    <Link
                      key={season.url}
                      href={`/animedetailpage${season.url}`}
                      className="relative w-full h-15 rounded-md overflow-hidden border-0 hover:border-1 hover:border-white"
                    >
                      {/* Blurred background image */}
                      <img
                        src={season.poster}
                        alt={season.title}
                        className="absolute inset-0 w-full h-full object-cover filter blur-xs brightness-50"
                      />
                      {/* Season title overlay */}
                      <div className="relative z-10 text-white flex items-center justify-center h-full text-center px-2 text-sm ">
                        {season.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : (
              ""
            )}

            {/* Characters & Voice Actors */}
            <div className="characters voice_actors">
              {/* Heading + "View more" link */}
              <div className="flex items-center justify-between mb-4">
                {animeDetail.characters && animeDetail.characters.length > 0 ? (
                  <h2 className="text-2xl font-bold text-[#BB5052] mt-10 mb-4">
                    Characters &amp; Voice Actors
                  </h2>
                ) : (
                  ""
                )}
                {animeDetail.characters && animeDetail.characters.length > 0 ? (
                  <Link
                    href="#"
                    className="text-lg text-gray-300 hover:underline mt-10 mb-4 hover:text-[#bb5052]"
                  >
                    View more{" "}
                    <FontAwesomeIcon
                      icon={faGreaterThan}
                      className="text-sm ml-1"
                    />
                  </Link>
                ) : (
                  ""
                )}
              </div>

              {/* Character grid (2 columns per row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {animeDetail.characters?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white/10 p-4 rounded-md"
                  >
                    {/* Left side: Character info */}
                    <div className="flex items-center gap-4">
                      {/* Character image */}
                      <img
                        src={item.char_img}
                        alt={item.character}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {/* Character name + role */}
                      <div>
                        <p className="text-white font-semibold hover:text-[#bb5052]">
                          {item.character}
                        </p>
                        <p className="text-gray-300 text-sm">{item.role}</p>
                      </div>
                    </div>

                    {/* Right side: Voice Actor info */}
                    <div className="flex items-center gap-4">
                      {/* VA name + nationality */}
                      <div className="text-right">
                        <p className="text-white font-semibold hover:text-[#bb5052]">
                          {item.voice_actor}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {item.nationality}
                        </p>
                      </div>
                      {/* VA image */}
                      <img
                        src={item.va_img}
                        alt={item.voice_actor}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {animeDetail.trailers && animeDetail.trailers.length > 0 ? (
              <div className="promotion_video">
                {/* Promotion Videos */}
                <h2 className="text-2xl font-bold mt-10 mb-6 text-[#BB5052]">
                  Promotion Videos
                </h2>

                {/* Grid of Trailer Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {animeDetail.trailers?.map((trailer) => (
                    <div
                      key={trailer.video_url}
                      className="bg-[#191919] rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Thumbnail + Play Overlay (clickable link) */}
                      <Link
                        href={trailer.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group relative"
                      >
                        {/* Video Thumbnail */}
                        <img
                          src={trailer.thumbnail}
                          alt={trailer.title}
                          className="w-100 h-30 object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/60 p-3 rounded-full group-hover:transition duration-300">
                            <FontAwesomeIcon
                              icon={faPlay}
                              className="text-[white] text-xl"
                            />
                          </div>
                        </div>
                      </Link>

                      {/* Title Caption */}
                      <div className="bg-[#191919] text-white text-center p-2 font-bold">
                        {trailer.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}

            {/* Recommended for You */}
            <div className="recommended_for_you">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#bb5052] mt-10 mb-4">
                  Recommended for you
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {animeDetail.recommended_anime?.map((anime, idx) => (
                  <Link
                    key={idx}
                    href={`/animedetailpage${anime.url}`}
                    className="relative w-full h-80 rounded-md overflow-hidden group"
                  >
                    {/* 
          We create two "sections":
            1) A top container (75% height) for the image and badges.
            2) A bottom container (25% height) for the title and type/runtime.
        */}

                    {/* Top 75% (Image + gradient + badges) */}
                    <div className="relative w-full h-[75%]">
                      {/* The poster itself */}
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Gradient at the bottom of the image */}
                      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />

                      {/* Badges row near the bottom of the image */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center flex-wrap gap-[2px] z-10 text-white">
                        {/* Subtitle CC */}
                        {anime.subtitles ? (
                          <span className="px-1 py-0.5 bg-green-300 text-black border-l border-white/10 flex items-center rounded-l-md text-xs font-bold">
                            <FontAwesomeIcon
                              icon={faClosedCaptioning}
                              className="mr-1"
                            />
                            {anime.subtitles}
                          </span>
                        ) : null}

                        {/* Dubbing */}
                        {anime.dubbing ? (
                          <span className="px-1 py-0.5 bg-pink-300 text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold">
                            <FontAwesomeIcon
                              icon={faMicrophone}
                              className="mr-1"
                            />
                            {anime.dubbing}
                          </span>
                        ) : null}

                        {/* Episodes */}
                        {anime.episodes ? (
                          <span className="bg-[#ffffff40] episode text-white text-xs font-semibold rounded-r-md px-2 py-0.5">
                            {anime.episodes}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Bottom 25% (Title + type/runtime) */}
                    <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white">
                      {/* Anime title */}
                      <h3 className="absolute left-3 top-3 font-semibold text-sm leading-tight line-clamp-2">
                        {anime.title}
                      </h3>

                      {/* Type/runtime row */}
                      <div className="absolute bottom-2 left-3 text-xs text-gray-300 mt-1 flex items-center">
                        <span>{anime.type}</span>
                        <span className="mx-2 text-base">•</span>
                        <span>{anime.runtime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Block */}
          <div className="md:w-1/4 p-4 rounded-md">
            {animeDetail?.related_anime?.length > 0 && (
              <section className="related_anime">
                <h2 className="text-2xl font-bold mb-4 text-[#BB5052] mt-2">
                  Related Anime
                </h2>

                {animeDetail.related_anime
                  .slice(0, showCount)
                  .map((related, index) => {
                    const isLastCard =
                      index === showCount - 1 &&
                      animeDetail.related_anime.length > showCount;

                    return (
                      <div key={related.url}>
                        {/* Card Container */}
                        <div
                          className="flex bg-[#191919] p-4"
                          style={{ minHeight: "120px" }}
                        >
                          {/* Left Part (20% width): Thumbnail */}
                          <div className="w-[20%] flex-shrink-0">
                            {related.poster ? (
                              <img
                                src={related.poster}
                                alt={related.title}
                                className="w-25 h-25 object-cover rounded-md mr-4"
                              />
                            ) : null}
                          </div>

                          {/* Middle Part (75% width): Title, Badges */}
                          <div className="w-[75%] px-3 flex flex-col justify-center ">
                            <div>
                              <h3 className="text-white text-lg font-medium mb-2 hover:text-[#BB5052] line-clamp-2">
                                <Link href={`/animedetailpage${related.url}`}>
                                  {related.title}
                                </Link>
                              </h3>
                              <div className="flex items-center flex-wrap gap-[2px]">
                                {related.subtitles && (
                                  <span className="px-1 py-1 bg-green-300 text-black border-l border-white/10 flex items-center rounded-l-md text-xs font-bold">
                                    <FontAwesomeIcon
                                      icon={faClosedCaptioning}
                                      className="mr-1"
                                    />
                                    {related.subtitles}
                                  </span>
                                )}
                                {related.dubbing && (
                                  <span className="px-1 py-1 bg-pink-300 text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold">
                                    <FontAwesomeIcon
                                      icon={faMicrophone}
                                      className="mr-1"
                                    />
                                    {related.dubbing}
                                  </span>
                                )}
                                {related.episodes && (
                                  <span className="bg-[#ffffff50] text-white text-xs font-semibold px-2 py-1">
                                    {related.episodes}
                                  </span>
                                )}
                                {related.type && (
                                  <>
                                    <span className="text-white ml-2 mr-2">
                                      •
                                    </span>
                                    <span className="text-white text-sm">
                                      {related.type}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Part (5% width): Plus Icon */}
                          <div className="w-[5%] flex justify-center items-center">
                            <Link
                              href="/"
                              className="text-white text-lg font-bold"
                            >
                              <FontAwesomeIcon icon={faPlus} className="mr-1" />
                            </Link>
                          </div>
                        </div>

                        {/* Divider */}
                        {!isLastCard && index < showCount - 1 && (
                          <hr className="border-t border-s-gray-50 w-[90%] mx-4" />
                        )}

                        {/* Show More */}
                        {isLastCard && (
                          <div className="flex bg-[#191919] p-4 pt-2 justify-center">
                            <button
                              onClick={() => setShowCount(showCount + 5)}
                              className="inline-block bg-[#BB5052] text-black px-4 py-2 font-semibold hover:bg-[#A04345] w-80 text-center rounded-sm"
                            >
                              Show More
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </section>
            )}

            <section className="most_popular flex flex-col">
              {/* Section Title */}
              <h2 className="text-2xl font-bold mb-6 text-[#BB5052] mt-8">
                Most Popular
              </h2>

              {animeDetail?.most_popular_anime &&
              animeDetail.most_popular_anime.length > 0 ? (
                animeDetail.most_popular_anime.map((anime, index) => (
                  <div key={anime.url}>
                    {/* Card Container */}
                    <div
                      className="flex bg-[#191919] p-4"
                      style={{ minHeight: "120px" }}
                    >
                      {/* Left Part (20% width): Thumbnail */}
                      <div className="w-[20%] flex-shrink-0">
                        <img
                          src={anime.poster}
                          alt={anime.title}
                          className="w-25 h-25 object-cover rounded-md mr-4"
                        />
                      </div>

                      {/* Middle Part (75% width): Title & Badges */}
                      <div className="w-[75%] px-3 flex flex-col justify-center ">
                        {/* Title & Badges */}
                        <div>
                          <h3 className="text-white text-lg font-medium mb-2 hover:text-[#BB5052] line-clamp-2">
                            <Link href={`/animedetailpage${anime.url}`}>
                              {anime.title}
                            </Link>
                          </h3>
                          <div className="flex items-center flex-wrap gap-[2px]">
                            {anime.subtitles && (
                              <span className="px-1 py-1 bg-green-300 text-black border-l border-white/10 flex items-center rounded-l-md text-xs font-bold">
                                <FontAwesomeIcon
                                  icon={faClosedCaptioning}
                                  className="mr-1"
                                />
                                {anime.subtitles}
                              </span>
                            )}
                            {anime.dubbing && (
                              <span className="px-1 py-1 bg-pink-300 text-black border-l border-white/10 flex items-center gap-1 text-xs font-bold">
                                <FontAwesomeIcon
                                  icon={faMicrophone}
                                  className="mr-1"
                                />
                                {anime.dubbing}
                              </span>
                            )}
                            {anime.episodes && (
                              <span className="bg-[#ffffff50] text-white text-xs font-semibold px-2 py-1">
                                {anime.episodes}
                              </span>
                            )}
                            {anime.type && (
                              <span className="text-white ml-2 mr-2">•</span>
                            )}
                            {anime.type && (
                              <span className="text-white text-sm">
                                {anime.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Part (5% width): Plus Icon */}
                      <div className="w-[5%] flex justify-center items-center">
                        <Link href="/" className="text-white text-lg font-bold">
                          <FontAwesomeIcon icon={faPlus} className="mr-1" />
                        </Link>
                      </div>
                    </div>

                    {/* HR (rendered between cards, not after the last one) */}
                    {index < animeDetail.most_popular_anime.length - 1 && (
                      <hr className="border-t border-s-gray-50 mx-4" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-white">No Most Popular anime found.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
