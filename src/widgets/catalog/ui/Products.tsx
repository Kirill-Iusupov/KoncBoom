"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import ItemCard from "@/src/features/ItemCard";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import { CategoryFilters } from "@/src/widgets/categoriesFilter/ui/CategoryFilters";

export const Products = () => {
  const { products, getProducts, isLoading } = useProductsStore();
  const searchParams = useSearchParams();

  const category = searchParams?.get("category");
  const initialState = !category ? "Все" : category;
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    initialState,
  );

  useEffect(() => {
    getProducts();
  }, []);

  const { results } = products;

  const filteredItems = useMemo(() => {
    if (activeCategory === "Все") return results;
    return results.filter((item) => item.categorie === activeCategory);
  }, [results, activeCategory]);
  return (
    <div className="w-full flex flex-col justify-center gap-10 mt-10">
      <CategoryFilters active={activeCategory} onChange={setActiveCategory} />

      {isLoading ? (
        <>Loading...</>
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
