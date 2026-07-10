"use client";

import { useProductsStore } from "@/src/entities/catalog/model/store";
import EmptyPromos from "@/src/features/emptyPromos";
import ItemCard from "@/src/features/ItemCard";
import { Product } from "@/src/shared/model/types";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const Searching = () => {
  const searchParams = useSearchParams();
  const searchRequest = searchParams?.get("search");
  const { products, getProducts } = useProductsStore();

  useEffect(() => {
    getProducts();
  }, []);

  const { results } = products;

  const findProducts: Product[] = searchRequest
    ? results.filter((product) => {
        const query = searchRequest.toLowerCase();
        return (
          product.title.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
        );
      })
    : [];

  return (
    <>
      <div className="w-full text-center my-10 text-[36px] font-medium">
        <h4>Результаты поиска для {searchRequest?.toUpperCase()}</h4>
      </div>
      <div className="flex flex-wrap items-center gap-5 mb-10">
        {findProducts.length > 0 ? (
          <>
            {findProducts.map((product) => (
              <ItemCard item={product} key={product.id} />
            ))}
          </>
        ) : (
          <EmptyPromos title={"Продуктов не обнаружено"} description="" />
        )}
      </div>
    </>
  );
};
