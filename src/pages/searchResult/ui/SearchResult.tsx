"use client";
import { Suspense } from "react";

import { Wrapper } from "@/src/shared/ui/Wrapper";
import Searching from "@/src/widgets/searching";

export const SearchResult = () => {
  return (
    <div>
      <Wrapper>
        <Suspense>
          <Searching />
        </Suspense>
      </Wrapper>
    </div>
  );
};
