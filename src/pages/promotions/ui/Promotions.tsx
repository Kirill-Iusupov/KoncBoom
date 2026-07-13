"use client";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import { Wrapper } from "@/src/shared/ui/Wrapper";
import { Discounts } from "@/src/widgets/discounts";
import Heading from "@/src/widgets/heading";
import { PromsOnMain } from "@/src/widgets/promsOnMain";
import React, { useEffect } from "react";

export const Promotions = () => {
  const { getProducts, isLoading } = useProductsStore();

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div>
      <Heading />
      <Wrapper>
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
            <div className="mt-[40px]">
              <PromsOnMain />
            </div>
            <div className="mt-[80px]">
              <h3 className="mb-[20px] text-[30px]">Товары по акции</h3>
              <Discounts />
            </div>
          </>
        )}
      </Wrapper>
    </div>
  );
};
