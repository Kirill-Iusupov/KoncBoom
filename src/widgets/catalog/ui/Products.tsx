"use client";

import { useEffect, useState } from "react";
import ItemCard from "@/src/features/ItemCard";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import { CategoryFilters } from "@/src/widgets/categoriesFilter/ui/CategoryFilters";
import EmptyPromos from "@/src/features/emptyPromos";

export const Products = () => {
  const [isClient, setIsClient] = useState(false);
  const { products, getProducts, isLoading } = useProductsStore();

  // Гарантируем, что код выполнится строго на клиенте после монтирования
  useEffect(() => {
    setIsClient(true);
    console.log("🔥 БРАУЗЕРНЫЙ useEffect СРАБОТАЛ!");
    getProducts();
  }, [getProducts]);

  if (!isClient) {
    return <div className="w-full flex justify-center mt-10">Инициализация...</div>;
  }

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
