import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function FilterContainer() {
  return (
    <div className="p-5 pl-20 pr-32">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-[#bb5052] uppercase">
        Filter
      </h2>

      {/* Filter Section */}
      {/* Using inline style for gridTemplateColumns to ensure each column is exactly 16%. */}
      <div
        className="grid gap-3 text-[#505050] "
        style={{ gridTemplateColumns: "20% 20% 20% 20% 20%" }}
      >
        {/* Anime Title for search */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="anime-title"></label>
          <input type="text" id="anime-title" placeholder="Anime Title" />
        </div>

        {/* Type  */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="type" className="inline-block w-[88%]">Type</label>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[12%]"
            />
          </span>
        </div>

        {/* Genres  */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="genres" className="inline-block w-[88%]">Genres</label>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[12%]"
            />
          </span>
        </div>

        {/* Year  */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="year" className="inline-block w-[88%]">Year</label>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[12%]"
            />
          </span>
        </div>

        {/* Rating  */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="rating" className="inline-block w-[88%]">Rating</label>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[12%]"
            />
          </span>
        </div>

        {/* Status  */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="status" className="inline-block w-[88%]">Status</label>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[12%]"
            />
          </span>
        </div>

        {/* Season  */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="season" className="inline-block w-[88%]">Season</label>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[12%]"
            />
          </span>
        </div>

        {/* Language  */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="language" className="inline-block w-[88%]">Language</label>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[12%]"
            />
          </span>
        </div>

        {/* Default  */}
        <div className="bg-[#191919] p-2 hover:bg-[#303030]">
          <label htmlFor="default" className="inline-block w-[88%]">Default</label>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-[12%]"
            />
          </span>
        </div>
      
        <div className="bg-[#353535] p-2 hover:bg-[#505050] text-white text-center text-base tracking-[1.5px]">
          <button>Filter</button>
        </div>
      </div>
    </div>
  );
}
