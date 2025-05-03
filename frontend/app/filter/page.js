import { Suspense } from "react";
import FilterClientPage from "./FilterClientPage";
import FilterSkeleton from "@/components/Skeleton-UI/FilterSkeleton";

export default function FilterPageWrapper() {
  return (
    <Suspense fallback={<FilterSkeleton />}>
      <FilterClientPage />
    </Suspense>
  );
}
