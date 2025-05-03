"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ImageSlider from "@/components/ImageSlider";
import TopSectionList from "@/components/TopSectionList";
import NewSectionList from "@/components/NewSectionList";
import GenresList from "@/components/GenresList";
import MostViewed from "@/components/MostViewed";
import TrendingCarousel from "@/components/TrendingCarousel";
import PersonalRecommendationList from "@/components/PersonalRecommendationList";
import ImageSliderSkeleton from "@/components/Skeleton-UI/ImageSliderSkeleton";
import TrendingSectionSkeleton from "@/components/Skeleton-UI/TrendingSectionSkeleton";
import PersonalRecommendationSkeleton from "@/components/Skeleton-UI/PersonalRecommendationSkeleton";
import TopSectionListSkeleton from "@/components/Skeleton-UI/TopSectionListSkeleton";
import NewSectionListSkeleton from "@/components/Skeleton-UI/NewSectionListSkeleton";
import GenresListSkeleton from "@/components/Skeleton-UI/GenresListSkeleton";
import MostViewedSkeleton from "@/components/Skeleton-UI/MostViewedSkeleton";
import FadeIn from "@/components/animations/FadeIn";

export default function HomePage() {
  const [homepageData, setHomepageData] = useState(null);
  const [PersonalRecommendations, setPersonalRecommendations] = useState(null);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.NEXT_PUBLIC_API_URL}/`)
  //     .then((response) => {
  //       setHomepageData(response.data);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching homepage data:", err);
  //       setError("Error fetching homepage data");
  //     });
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Fetch homepage data
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/`, { headers })
      .then((response) => {
        setHomepageData(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.error("Error fetching homepage data:", err);
        setError("Error fetching homepage data");
      });

    // If token exists, fetch personal recommendations
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/personal-recommendations`, {
          headers,
        })
        .then((response) => {
          setPersonalRecommendations(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.error("Error fetching personal recommendations:", err);
          setError("Error fetching personal recommendations");
        });
    }
  }, []);

  if (error) return <div>{error}</div>;
  if (!homepageData) {
    return (
      <main className="p-4 bg-black min-h-screen text-white">
        <ImageSliderSkeleton />
        <PersonalRecommendationSkeleton />
        <TrendingSectionSkeleton />

        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TopSectionListSkeleton />
          <TopSectionListSkeleton />
          <TopSectionListSkeleton />
          <TopSectionListSkeleton />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-3/4 flex flex-col gap-4">
            <NewSectionListSkeleton/>
            <NewSectionListSkeleton/>
            <NewSectionListSkeleton/>
          </div>

          <div className="lg:w-1/4 flex flex-col gap-4">
            <GenresListSkeleton/>
            <MostViewedSkeleton/>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="p-4 bg-black min-h-screen text-white">
    <FadeIn>
      <ImageSlider sliderData={homepageData.image_slider} />
    </FadeIn>
  
    {PersonalRecommendations?.length > 0 && (
      <FadeIn>
        <PersonalRecommendationList recommendations={PersonalRecommendations} />
      </FadeIn>
    )}
  
    <FadeIn>
      <TrendingCarousel trendingData={homepageData.trending_anime} />
    </FadeIn>
  
    {/* First Row: 4 Sections */}
    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {homepageData.top_sections.map((sectionData, idx) => (
        <FadeIn key={idx}>
          <TopSectionList sectionData={sectionData} />
        </FadeIn>
      ))}
    </div>
  
    {/* Second Row: Two-Column Layout */}
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="lg:w-3/4 flex flex-col gap-4">
        {homepageData.latest_new_upcoming.map((sectionData, idx) => (
          <FadeIn key={idx}>
            <NewSectionList sectionData={sectionData} />
          </FadeIn>
        ))}
      </div>
  
      <div className="lg:w-1/4 flex flex-col gap-4">
        <FadeIn>
          <GenresList genres={homepageData.genres} />
        </FadeIn>
        <FadeIn>
          <MostViewed mostViewed={homepageData.most_viewed} />
        </FadeIn>
      </div>
    </div>
  </main>
  );
}
