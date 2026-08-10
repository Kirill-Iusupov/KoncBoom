"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import ItemCard from "@/src/features/ItemCard";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import { CategoryFilters } from "@/src/widgets/categoriesFilter/ui/CategoryFilters";
import EmptyPromos from "@/src/features/emptyPromos";

export const Products = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { products, getProducts, isLoading } = useProductsStore();
  const searchParams = useSearchParams();

  // Фиксируем момент, когда компонент перешел на клиент
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const category = searchParams?.get("category");
  const initialState = !category ? "Все" : category;
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    initialState,
  );

  // Вызываем загрузку товаров строго после монтирования в браузере
  useEffect(() => {
    if (isMounted) {
      console.log("Компонент смонтирован, вызываем getProducts()");
      getProducts();
    }
  }, [isMounted, getProducts]);

  // Пока компонент не смонтирован на клиенте, возвращаем безопасный заглушечный HTML
  if (!isMounted) {
    return <div className="w-full flex justify-center mt-10">Loading...</div>;
  }

  const { results } = products;

  const filteredItems = useMemo(() => {
    if (activeCategory === "Все") return results;
    return results.filter((item) => item.categorie === activeCategory);
  }, [results, activeCategory]);

  return (
    <div className="w-full flex flex-col justify-center gap-10 mt-10 mb-10">
      <CategoryFilters active={activeCategory} onChange={setActiveCategory} />

      {isLoading ? (
        <div>Loading...</div>
      ) : filteredItems.length <= 0 ? (
        <EmptyPromos title="Нет товаров выбранной категории" description="" />
      ) : (
        <div className="flex flex-wrap gap-5">
          {filteredItems.map((item) => (
            <ItemCard item={item} key={item.id} />
          ))}
        </div>
      )}
    </div>
  );
};
