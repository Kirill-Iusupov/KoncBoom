"use client";

import ItemCard from "@/src/features/ItemCard";
import { Wrapper } from "@/src/shared/ui/Wrapper";
import { CategoryFilters } from "@/src/widgets/categoriesFilter/ui/CategoryFilters";
import { useEffect, useMemo, useState } from "react";
import { useProductsStore } from "../model/store";

export const Catalog = () => {
  const { products, getProducts, isLoading } = useProductsStore();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    getProducts();
  }, []);

  const { results = [] } = products;

  const filteredItems = useMemo(() => {
    if (activeCategory === "Все") return results;
    return results.filter((item) => item.categorie === activeCategory);
  }, [results, activeCategory]);

  return (
    <div className="my-20">
      <Wrapper>
        <div className="w-full flex flex-col justify-center gap-10">
          <CategoryFilters
            active={activeCategory}
            onChange={setActiveCategory}
          />

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
      </Wrapper>
    </div>
  );
};
