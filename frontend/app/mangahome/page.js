"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import MangaImageSlider from "@/components/manga-home/MangaImageSlider";
import TrendingSection from "@/components/manga-home/TrendingCrousel";
import Genres from "@/components/manga-home/Genres";
import MostViewed from "@/components/manga-home/MostViewed";
import CardsSection from "@/components/manga-home/CardSection";
import LatestUpdate from "@/components/manga-home/LatestUpdates";
import ContinueReading from "@/components/manga-home/ContinueReading";
import PersonalRecommendations from "@/components/manga-home/PersonalRecommendations";


export default function MangaHomePage() {
  const [homepageData, setHomepageData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/mangahome`, { headers })
      .then((response) => {
        setHomepageData(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.error("Error fetching homepage data:", err);
        setError("Error fetching homepage data");
      });
  }, []);
  

  if (error) return <div>{error}</div>;
  if (!homepageData) return <div>Loading...</div>;

  return (
    <main className="bg-black min-h-screen text-white p-4">
      <MangaImageSlider sliderData={homepageData.image_slider} />
      <ContinueReading continueReadingData={homepageData.continue_reading}/>
      <PersonalRecommendations mangaList={homepageData.personal_recommendations} />
      <TrendingSection trendingData={homepageData.trending} />
      {/*  Row: Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column (75% width) */}
        <div className="lg:w-3/4 flex flex-col gap-4">
          <CardsSection title="Recommended for you" items={homepageData.recommended} />
          <LatestUpdate latest_update={homepageData.latest_update} />
          <CardsSection title="Completed" items={homepageData.completed} />
        </div>

        {/* Right Column (25% width) */}
        <div className="lg:w-1/4 flex flex-col gap-4">
          <Genres genres={homepageData.genres} />
          <MostViewed mostViewed={homepageData.most_viewed} />
        </div>
      </div>
    </main>
  );
}
