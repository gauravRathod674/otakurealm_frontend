"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faPlus,
  faPlay,
  faGreaterThan,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Helper: Finds the episode range key (like "101-200") which includes the current episode.
 * Expects episodeRanges to be an object where each key maps to an array of objects with "episode" (a string) and "url".
 */
function findRangeKeyForEpisode(episodeRanges, currentEpisode) {
  for (const [rangeKey, episodes] of Object.entries(episodeRanges)) {
    if (
      episodes.some((epObj) => parseInt(epObj.episode, 10) === currentEpisode)
    ) {
      return rangeKey;
    }
  }
  return Object.keys(episodeRanges)[0] || "";
}

export default function WatchPage() {
  // State hooks – always called in the same order.
  const [animeDetail, setAnimeDetail] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(5);
  const [currentServer, setCurrentServer] = useState({
    type: "Sub:",
    name: "Megaplay-1",
  });
  const [selectedRange, setSelectedRange] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [currentEp, setCurrentEp] = useState(0);
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = useParams();
  const title = searchParams.get("title") || "";
  const anime_type = searchParams.get("anime_type") || "";
  const { slug, episode } = params;

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      return;
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/watch/${slug}/${episode}`, {
        params: { title, anime_type },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Data received from /watch endpoint:", response.data);
        setData(response.data);
        setAnimeDetail(response.data.anime_detail);
        setIframeSrc(response.data.iframe_src);
        // Set the initial current episode from the fetched data.
        setCurrentEp(parseInt(response.data.current_episode_number || "1", 10));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching /watch API:", error);
        setLoading(false);
      });
  }, [title, anime_type, slug, episode]);

  // Early return while loading or if no data received.
  if (loading) {
    return <p className="p-4">Loading watch data...</p>;
  }
  if (!data) {
    return <p className="p-4">No data received.</p>;
  }
  if (!animeDetail) {
    return <p className="p-4">Loading anime data...</p>;
  }

  console.log("Anime Detail:", data.anime_detail);

  // Derived values (computed only after data is loaded)
  const currentEpisode = parseInt(data.current_episode_number || "1", 10);
  const episodeRanges = data.video_details?.episode_ranges || {};

  // Compute a default range if selectedRange is not already set.
  const computedSelectedRange =
    Object.keys(episodeRanges).length > 0
      ? selectedRange || findRangeKeyForEpisode(episodeRanges, currentEpisode)
      : "";
  const episodesToShow = episodeRanges[computedSelectedRange] || [];

  // const episodeNumber = data.current_episode_number;

  // Because we want to do 2 lines only, we rely on Tailwind line-clamp plugin:
  // "line-clamp-2" if not expanded, "line-clamp-none" if expanded.

  const descriptionClass = expanded ? "line-clamp-none" : "line-clamp-2";

  const handleEpisodeClick = async (ep) => {
    const epNumber = parseInt(ep.episode, 10);
    setCurrentEp(epNumber);

    console.log("Old iframe src = ", iframeSrc);

    // Update the URL without a full page reload
    const newEpisodeSlug = `ep-${epNumber}`;
    router.push(
      `/watch/${slug}/${newEpisodeSlug}?title=${title}&anime_type=${anime_type}`,
      {
        scroll: false,
      }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/temp/switch_episode`,
        {
          params: {
            episode_url: String(ep.url),
            anime_title: String(animeDetail.title),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newIframeSrc = response.data.iframe_src;
      if (newIframeSrc) {
        console.log("New iframesrc = ", newIframeSrc);
        setIframeSrc(newIframeSrc);
      } else {
        console.error("Failed to fetch new iframe src:", response.data.message);
      }
    } catch (error) {
      console.error("Error switching episode:", error);
    }
  };

  // const displayDescription = expanded ? fullDescription : shortDescription;

  return (
    <div className="watch-page-container min-h-screen bg-[#121212] text-white mt-17 px-4">
      <div className="main-content flex flex-col lg:flex-row gap-6">
        {/* Primary Section (3/4) */}
        <div className="primary-sectionw-full lg:w-3/4 p-4  bg-[#121212]">
          {/* Video Player */}
          {data.iframe_src ? (
            <iframe
              src={iframeSrc}
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{
                width: "100%",
                height: "60vh",
                overflow: "hidden",
                border: 0,
              }}
              className="mb-6"
            ></iframe>
          ) : (
            <p>Loading video...</p>
          )}

          {/* Server Wrapper */}
          <div className="server-wrapper flex flex-col md:flex-row bg-[#191919]">
            {/* Episode Info */}
            <div className="server-info w-full md:w-[30%] p-4 flex flex-col justify-center items-center bg-[#252525]">
              <p className="text-gray-200 text-base text-center">
                You are watching{" "}
                <span className="font-bold text-white">
                  Episode {currentEp}
                </span>
              </p>
              <p className="text-sm text-gray-400 text-center mt-2">
                (If the current server doesn't work, try other servers.)
              </p>
            </div>
            {/* Server Listing */}
            <div className="server-listing w-full md:w-[70%] p-4 flex flex-col gap-3">
              {data.video_details?.servers_info &&
                Object.entries(data.video_details.servers_info).map(
                  ([typeLabel, servers]) => {
                    const icon = typeLabel.toLowerCase().includes("sub")
                      ? faClosedCaptioning
                      : faMicrophone;
                    return (
                      <div
                        key={typeLabel}
                        className="flex flex-wrap items-center gap-4"
                      >
                        <div className="flex items-center gap-2 text-gray-300 uppercase text-sm w-[80px]">
                          <FontAwesomeIcon icon={icon} className="text-base" />
                          <span>{typeLabel}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-1">
                          {servers.map((serverName) => {
                            const isDownload = serverName
                              .toLowerCase()
                              .includes("download");
                            const isActive =
                              typeLabel === currentServer.type &&
                              serverName === currentServer.name;
                            return (
                              <button
                                key={serverName}
                                onClick={() =>
                                  setCurrentServer({
                                    type: typeLabel,
                                    name: serverName,
                                  })
                                }
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                  isDownload
                                    ? "bg-transparent border border-gray-500 text-gray-300 hover:border-white"
                                    : isActive
                                    ? "bg-[#bb5052] text-white"
                                    : "bg-[#2c2c2c] text-white hover:bg-[#3a3a3a]"
                                }`}
                              >
                                {isDownload ? (
                                  <FontAwesomeIcon
                                    icon={faDownload}
                                    className="mr-1"
                                  />
                                ) : (
                                  serverName
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>

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

          {/* Episode Wrapper */}
          <section className="episode-wrapper p-4 mt-8 text-gray-200 text-sm rounded-md">
            {/* Top Bar: Range Dropdown */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative group">
                <button className="bg-[#191919] text-white px-4 py-2 rounded inline-flex items-center">
                  <span>{computedSelectedRange}</span>
                  <svg
                    className="ml-2 w-4 h-4 fill-current text-gray-300"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.516 7.548l4.484 4.484 4.484-4.484 1.416 1.416-5.9 5.9-5.9-5.9z" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full bg-[#2c2c2c] rounded shadow-lg hidden group-hover:block z-10">
                  {Object.keys(episodeRanges).map((rangeKey) => (
                    <button
                      key={rangeKey}
                      onClick={() => setSelectedRange(rangeKey)}
                      className="block px-4 py-2 text-left bg-[#2c2c2c] text-white hover:bg-[#bb5052] w-full"
                    >
                      {rangeKey}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Episode Grid */}
            <div className="episode-grid grid grid-cols-8 sm:grid-cols-10 md:grid-cols-[repeat(15,minmax(0,1fr))] max-[370px]:grid-cols-5 max-[632px]:gap-1.5 gap-2">
              {episodesToShow.map((ep) => {
                const epNumber = parseInt(ep.episode, 10);
                const isCurrent = epNumber === currentEp;
                return (
                  <button
                    key={ep.episode}
                    onClick={() => handleEpisodeClick(ep)}
                    className={`px-3 py-2 p-[0.25rem] text-sm flex items-center justify-center rounded text-center transition-colors ${
                      isCurrent
                        ? "bg-[#bb5052] text-white"
                        : ep.is_filler
                        ? "bg-[#4f2405] text-white hover:bg-[#bb5052]"
                        : "bg-transparent border-1 flex justify-center items-center border-[#404040] text-gray-400 hover:bg-[#bb5052] hover:text-white"
                    }`}
                  >
                    {ep.episode}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Anime Details */}
          <section className="w-full bg-transparent text-white p-5 rounded-md flex flex-col md:flex-row gap-4">
            {/* LEFT: Poster + mobile/tablet title+stats+desc */}
            <div className="flex flex-col gap-4 w-full md:w-1/2 lg:w-auto">
              {/* Poster */}
              <div className="w-full lg:w-[220px] flex-shrink-0 ">
                <Image
                  src={animeDetail.poster}
                  alt={animeDetail.title}
                  width={400}
                  height={330}
                  // sizes="(max-width: 767px) 5\3\\0vw, (max-width: 1023px) 50vw, 220px"
                  className="w-full h-auto   max-[767px]:max-w-[200px] max-[767px]:max-h-[250px] max-[1024px]:max-w-[200px] max-[1024px]:max-h-[250px]  object-cover rounded-md"
                />
              </div>

              {/* [<=1023px] Title/Stats + Description (stay left on tablet) */}
              <div className="block lg:hidden flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{animeDetail.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  {animeDetail.film_stats.type && (
                    <span className="bg-[#bb5052] text-white text-xs font-semibold px-2 py-1 rounded uppercase">
                      {animeDetail.film_stats.type}
                    </span>
                  )}
                  {animeDetail.film_stats.rating && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded">
                      {animeDetail.film_stats.rating}
                    </span>
                  )}
                  {animeDetail.film_stats.quality && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded">
                      {animeDetail.film_stats.quality}
                    </span>
                  )}
                  {animeDetail.film_stats.subtitles && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <FontAwesomeIcon icon={faClosedCaptioning} />
                      {animeDetail.film_stats.subtitles}
                    </span>
                  )}
                  {animeDetail.film_stats.dubbing && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <FontAwesomeIcon icon={faMicrophone} />
                      {animeDetail.film_stats.dubbing}
                    </span>
                  )}
                  {animeDetail.episodes && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded">
                      {animeDetail.episodes} eps
                    </span>
                  )}
                </div>
                <div
                  className={`text-sm text-gray-300 leading-relaxed ${descriptionClass} overflow-hidden`}
                >
                  {animeDetail.description}
                </div>
                {animeDetail.description?.length > 200 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-sm text-[#bb5052] border border-[#bb5052] px-0.5 py-1 rounded-md w-[60px]"
                  >
                    {expanded ? "less" : "more"}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: Desktop title/stats/desc + Info grid */}
            <div className="flex flex-col w-full md:w-1/2 lg:w-full gap-4">
              {/* [>=1024px] Title/Stats + Description */}
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold mb-2">{animeDetail.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {animeDetail.film_stats.type && (
                    <span className="bg-[#bb5052] text-white text-xs font-semibold px-2 py-1 rounded uppercase">
                      {animeDetail.film_stats.type}
                    </span>
                  )}
                  {animeDetail.film_stats.rating && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded">
                      {animeDetail.film_stats.rating}
                    </span>
                  )}
                  {animeDetail.film_stats.quality && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded">
                      {animeDetail.film_stats.quality}
                    </span>
                  )}
                  {animeDetail.film_stats.subtitles && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <FontAwesomeIcon icon={faClosedCaptioning} />
                      {animeDetail.film_stats.subtitles}
                    </span>
                  )}
                  {animeDetail.film_stats.dubbing && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <FontAwesomeIcon icon={faMicrophone} />
                      {animeDetail.film_stats.dubbing}
                    </span>
                  )}
                  {animeDetail.episodes && (
                    <span className="bg-[#333] text-gray-200 text-xs font-semibold px-2 py-1 rounded">
                      {animeDetail.episodes} eps
                    </span>
                  )}
                </div>

                <div
                  className={`text-sm text-gray-300 ${descriptionClass} overflow-hidden mb-4`}
                >
                  {animeDetail.description}
                </div>
                {animeDetail.description?.length > 200 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-sm text-[#bb5052] border border-[#bb5052] px-0.5 py-1 rounded-md w-[60px] cursor-default"
                  >
                    {expanded ? "less" : "more"}
                  </button>
                )}
              </div>

              {/* Info Grid: single-col mobile, 2-col tablet+ */}
              <table className="w-full text-sm text-gray-300">
  <tbody>
    <tr>
      <td className="font-semibold w-24 lg:w-32 align-top">Type:</td>
      <td className=" align-top">{animeDetail.film_stats.type || "?"}</td>
      <td className="font-semibold w-24 lg:w-32 align-top">Premiered:</td>
      <td className="align-top">{animeDetail.premiered || "?"}</td>
    </tr>
    <tr>
      <td className="font-semibold align-top">Aired:</td>
      <td className="pr-8 align-top">{animeDetail.aired || "?"}</td>
      <td className="font-semibold align-top">Status:</td>
      <td className="align-top">{animeDetail.status || "?"}</td>
    </tr>
    <tr>
      <td className="font-semibold align-top">MAL:</td>
      <td className=" align-top">{animeDetail.score || "?"}</td>
      <td className="font-semibold align-top">Duration:</td>
      <td className="align-top">{animeDetail.duration || "?"}</td>
    </tr>
    <tr>
      <td className="font-semibold align-top">Episodes:</td>
      <td className=" align-top">{animeDetail.episodes || "?"}</td>
      <td className="font-semibold align-top">Studios:</td>
      <td className="align-top">{animeDetail.studios?.join(", ") || "?"}</td>
    </tr>
    <tr>
      <td className="font-semibold align-top">Genre:</td>
      <td className=" align-top" colSpan={1}>
        {animeDetail.genres?.join(", ") || "?"}
      </td>
      <td className="font-semibold align-top">Producers:</td>
      <td className="align-top">
        {animeDetail.producers?.join(", ") || "?"}
      </td>
    </tr>
  </tbody>
</table>

            </div>
          </section>
        </div>

        {/* Secondary Section (1/4) */}
        <div className="secondary-section w-full lg:w-1/4 p-4 rounded-md bg-[#121212]">
          {animeDetail?.related_anime?.length > 0 && (
            <section className="related_anime  mb-6">
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

          <section className="most_popular">
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
  );
}
