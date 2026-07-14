"use client";
import { useCategoriesStore } from "@/src/entities/categories/model/store";
import CategorieCard from "@/src/features/categoriesCard";
import React, { useEffect } from "react";

const ListCategories = () => {
  const { categories, getCategories } = useCategoriesStore();

  useEffect(() => {
    getCategories();
  }, []);

  const { results } = categories;

  return (
    <div className="flex gap-6 flex-wrap">
      {results.map((cat) => (
        <CategorieCard item={cat} key={cat.id} />
      ))}
    </div>
  );
};

export default ListCategories;
