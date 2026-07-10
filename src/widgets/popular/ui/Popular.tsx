"use client";

import { MainPageButton } from "@/src/shared/ui/MainPageButton";
import ItemCard from "@/src/features/ItemCard";

import { useEffect } from "react";
import { useProductsStore } from "@/src/entities/catalog/model/store";

const Popular = () => {
  const { products, getProducts, isLoading } = useProductsStore();

  useEffect(() => {
    getProducts();
  }, []);

  const { results } = products;

  return (
    <div className="flex flex-col gap-8 mb-20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-black">Популярное</h3>
        </div>
        <MainPageButton url="catalog" title="Все товары" />
      </div>
      <div className="flex gap-5 items-center flex-wrap">
        {results
          .filter((e) => e.popular)
          .slice(0, 4)
          .map((item) => (
            <ItemCard item={item} key={item.id} />
          ))}
      </div>
    </div>
  );
};

export default Popular;
