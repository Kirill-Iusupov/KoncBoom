"use client";

import { useEffect } from "react";
import ItemCard from "@/src/features/ItemCard";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import { CategoryFilters } from "@/src/widgets/categoriesFilter/ui/CategoryFilters";
import EmptyPromos from "@/src/features/emptyPromos";

export const Products = () => {
  const productsState = useProductsStore();
  const products = productsState?.products;
  const getProducts = productsState?.getProducts;
  const isLoading = productsState?.isLoading ?? false;

  useEffect(() => {
    console.log("🔥 ЭФФЕКТ ЗАПУЩЕН, вызываем getProducts");
    if (typeof getProducts === "function") {
      getProducts();
    }
  }, [getProducts]);

  const results = products?.results || [];

  return (
    <div className="w-full flex flex-col justify-center gap-10 mt-10 mb-10">
      <CategoryFilters active="Все" onChange={() => {}} />

      {isLoading ? (
        <div>Загрузка данных...</div>
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
