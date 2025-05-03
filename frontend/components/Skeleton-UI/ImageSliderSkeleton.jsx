"use client";

import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

const ImageSliderSkeleton = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only render after hydration
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-[70vh] bg-black overflow-hidden">
      <ContentLoader
        speed={2}
        width="100%"
        height="100%"
        viewBox="0 0 1280 600"
        backgroundColor="#1f1f1f"
        foregroundColor="#3a3a3a"
        style={{ width: "100%", height: "100%" }}
        {...props}
      >
        {/* Left Panel */}
        <rect x="60" y="80" rx="4" ry="4" width="120" height="20" />
        <rect x="60" y="120" rx="6" ry="6" width="500" height="30" />
        <rect x="60" y="160" rx="6" ry="6" width="460" height="30" />

        {/* Stats */}
        <rect x="60" y="210" rx="10" ry="10" width="70" height="24" />
        <rect x="140" y="210" rx="10" ry="10" width="70" height="24" />
        <rect x="220" y="210" rx="10" ry="10" width="70" height="24" />

        {/* Type & Runtime */}
        <circle cx="310" cy="222" r="4" />
        <rect x="320" y="210" rx="4" ry="4" width="60" height="20" />
        <circle cx="390" cy="222" r="4" />
        <rect x="400" y="210" rx="4" ry="4" width="60" height="20" />

        {/* Description */}
        <rect x="60" y="260" rx="3" ry="3" width="520" height="12" />
        <rect x="60" y="280" rx="3" ry="3" width="500" height="12" />
        <rect x="60" y="300" rx="3" ry="3" width="480" height="12" />

        {/* Buttons */}
        <rect x="60" y="340" rx="20" ry="20" width="140" height="40" />
        <rect x="210" y="340" rx="20" ry="20" width="120" height="40" />

        {/* Right Image */}
        <rect x="640" y="0" rx="0" ry="0" width="640" height="600" />
      </ContentLoader>
    </div>
  );
};

export default ImageSliderSkeleton;
