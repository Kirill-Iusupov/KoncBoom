"use client";

import { CatergoriesOnMain as Categories } from "@/src/widgets/categoriesOnMain";
import { Wrapper } from "@/src/shared/ui/Wrapper";
import { MainPageInfo as Info } from "@/src/widgets/mainPageInfo";
import Popular from "@/src/widgets/popular";
import { PromsOnMain as Promotions } from "@/src/widgets/promsOnMain";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import { useEffect } from "react";

export const MainPage = () => {
  const { getProducts, isLoading } = useProductsStore();

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Wrapper>
      <div className="flex flex-col gap-10!">
        <Info />
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
            <Promotions />
            <Categories />
            <Popular />
          </>
        )}
      </div>
    </Wrapper>
  );
};
