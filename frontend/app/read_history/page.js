"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function ReadHistoryPage() {
  const [history, setHistory] = useState(null); // Start with null to indicate loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/read_history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch read history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      // Ensure localStorage and other client-side features are only accessed on the client
      fetchReadHistory();
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this entry?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/delete_item/read_history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete read history entry:", error);
    }
  };

  const clearAllHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your entire read history?"
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/clear_history/read_history/clear`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory([]);  // Clear the history from the frontend
    } catch (error) {
      console.error("Failed to clear read history:", error);
    }
  };
  
  

  if (loading || history === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="px-5 md:px-20 py-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#bb5052]">
            Your Read History
          </h1>
          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p>No read history found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-7">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="relative w-full h-90 rounded-md overflow-hidden group"
              >
                {entry.read_url ? (
                  <Link href={`${entry.read_url}`} className="block w-full h-full">
                    <CardContent entry={entry} handleDelete={handleDelete} />
                  </Link>
                ) : (
                  <CardContent entry={entry} handleDelete={handleDelete} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CardContent({ entry, handleDelete }) {
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
      <button
        onClick={(e) => {
          e.preventDefault();
          handleDelete(entry.id);
        }}
        className="absolute top-0 right-0 text-white bg-gray-700 hover:bg-gray-800 p-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FontAwesomeIcon icon={faClose} />
      </button>

      <div className="relative w-full h-[75%]">
        <Image
          src={entry.cover_image_url || "/default-cover.jpg"}
          alt={entry.manga_title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={500} 
          height={750} 
          layout="intrinsic"
        />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#191919] to-transparent" />
        {entry.genres && entry.genres.length > 0 && (
          <div className="absolute bottom-6 left-0 w-full z-20 px-2 flex flex-col gap-1">
            <div className="flex flex-wrap justify-center gap-1">
              {entry.genres.slice(0, 3).map((genre, idx) => (
                <span
                  key={`genre-${idx}`}
                  className="inline-block text-xs text-white px-2 py-0.5 rounded bg-[rgba(255,255,255,0.1)]"
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

      <div className="relative w-full h-[25%] bg-[#191919] px-2 py-2 text-white flex flex-col justify-center">
        <h3 className="font-semibold text-base leading-tight line-clamp-2 text-center">
          <div>
            {entry.manga_title.replace(/\b\w/g, (c) => c.toUpperCase())}
          </div>
        </h3>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-1">
          <div className="text-center">
            <div>
              {entry.chapter_name.replace(/\b\w/g, (c) => c.toUpperCase())}
            </div>
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
