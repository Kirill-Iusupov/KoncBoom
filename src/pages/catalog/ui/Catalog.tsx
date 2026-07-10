import { Suspense } from "react";
import { Products } from "@/src/widgets/catalog";
import { Wrapper } from "@/src/shared/ui/Wrapper";

export const Catalog = () => {
  return (
    <div className="my-20">
      <Wrapper>
        <Suspense>
          <Products />
        </Suspense>
      </Wrapper>
    </div>
  );
};
