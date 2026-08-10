import { Suspense } from "react";
import { Products } from "@/src/widgets/catalog/ui/Products";
import { Wrapper } from "@/src/shared/ui/Wrapper";
import Heading from "@/src/widgets/heading";

export const Catalog = () => {
  console.log("🔥 РЕНДЕРИТСЯ СТРАНИЦА КАТАЛОГА");
  return (
    <div>
      <Heading />
      <Wrapper>
        <Suspense>
          <Products />
        </Suspense>
      </Wrapper>
    </div>
  );
};
