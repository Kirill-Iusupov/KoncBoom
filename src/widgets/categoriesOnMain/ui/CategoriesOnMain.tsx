"use client";

import CategorieCard from "@/src/features/categoriesCard";
import { MainPageButton as Button } from "@/src/shared/ui/MainPageButton";
import { useCategoriesStore } from "@/src/entities/categories/model/store";
import { useEffect } from "react";

const CategoriesOnMain = () => {
  const { categories, getCategories } = useCategoriesStore();

  useEffect(() => {
    getCategories();
  }, []);

  const { results } = categories;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-black">Категории</h3>
        </div>
        <Button title="Все категории" url="categories" />
      </div>
      <div className="flex gap-6 flex-wrap">
        {results.map((cat) => (
          <CategorieCard item={cat} key={cat.id} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesOnMain;
