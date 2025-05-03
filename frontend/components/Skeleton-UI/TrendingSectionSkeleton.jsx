"use client";

export default function TrendingSectionSkeleton() {
  return (
    <div className="my-8">
      <div
        className="h-6 rounded mb-4 ml-2"
        style={{
          width: "120px",
          backgroundColor: "#2b2b2b",
        }}
      ></div>

      <div className="relative p-3 rounded-md overflow-hidden">
        <div className="flex gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 animate-pulse"
              style={{
                width: "220px",
                height: "250px",
                backgroundColor: "#191919",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {/* Left rank + title placeholder */}
              <div
                className="absolute top-0 left-0 h-full flex flex-col items-center justify-center"
                style={{ width: "15%" }}
              >
                <div className="w-4 h-4 bg-[#2b2b2b] mb-2 rounded"></div>
                <div
                  className="bg-[#2b2b2b] rounded h-4"
                  style={{ width: "40px", transform: "rotate(-90deg)" }}
                ></div>
              </div>

              {/* Right image placeholder */}
              <div
                className="absolute top-0 right-0 h-full bg-[#2b2b2b]"
                style={{ width: "85%" }}
              />
            </div>
          ))}
        </div>

        {/* Dummy nav buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 right-2 flex flex-col gap-3">
          <div className="w-10 h-30 bg-[#353535] rounded-md opacity-50" />
          <div className="w-10 h-30 bg-[#353535] rounded-md opacity-50" />
        </div>
      </div>
    </div>
  );
}
