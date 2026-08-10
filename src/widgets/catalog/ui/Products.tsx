"use client";

import { useEffect } from "react";
import ItemCard from "@/src/features/ItemCard";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import { CategoryFilters } from "@/src/widgets/categoriesFilter/ui/CategoryFilters";
import EmptyPromos from "@/src/features/emptyPromos";

export const Products = () => {
  const { products, getProducts, isLoading } = useProductsStore();

  useEffect(() => {
    console.log("ЗАПРОС ТОВАРОВ ПОШЕЛ!");
    getProducts();
  }, [getProducts]);

  const { results } = products;

  return (
    <div className="w-full flex flex-col justify-center gap-10 mt-10 mb-10">
      <CategoryFilters active="Все" onChange={() => {}} />

      {isLoading ? (
        <div>Loading...</div>
      ) : results.length <= 0 ? (
        <EmptyPromos title="Нет товаров" description="" />
      ) : (
        <div className="flex flex-wrap gap-5">
          {results.map((item) => (
            <ItemCard item={item} key={item.id} />
          ))}
        </div>
      )}
    </div>
  );
};
