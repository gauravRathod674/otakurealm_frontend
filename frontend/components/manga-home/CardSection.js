"use client";

import React, { useState } from "react";
import Card from "./Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons"; // or any other icon

const CardsSection = ({ title, items = [] }) => {
  // Show only first 15 items by default.
  const [showMore, setShowMore] = useState(false);

  const displayedItems = showMore ? items : items.slice(0, 15);

  return (
    <div className="cards p-5 pt-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#bb5052]">{title}</h2>
        {items.length > 15 && !showMore && (
          <button
            onClick={() => setShowMore(true)}
            className="text-md hover:text-[#bb5052] hover:underline"
          >
            View More                         
            <FontAwesomeIcon icon={faGreaterThan} className="text-sm ml-2" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayedItems?.map((item, idx) => (
          <Card key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CardsSection;
