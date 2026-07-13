"use client";

import { MainPageButton as Button } from "@/src/shared/ui/MainPageButton";
import ListCategories from "./components/ListCategories";

const CategoriesOnMain = () => {

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-black">Категории</h3>
        </div>
        <Button title="Все категории" url="categories" />
      </div>
      <ListCategories/>
    </div>
  );
};

export default CategoriesOnMain;
