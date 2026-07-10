"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCategoriesStore } from "@/src/entities/categories/model/store";

const ALL_CATEGORY = "Все";
const MAX_CATEGORIES_ON_PAGE = 10;

interface ICategoryFiltersProps {
  active: string | undefined;
  onChange: (category: string) => void;
}

export const CategoryFilters = ({
  active,
  onChange,
}: ICategoryFiltersProps) => {
  const { categories, getCategories } = useCategoriesStore();

  useEffect(() => {
    getCategories();
  }, []);

  const { results = [] } = categories;

  // ограничиваем список видимых категорий, остальные доступны через "Другое...", если их больше чем MAX_CATEGORIES_ON_PAGE
  const visibleCategories = results.slice(0, MAX_CATEGORIES_ON_PAGE);

  useEffect(() => {
    if (!active) {
      onChange(ALL_CATEGORY);
    }
  }, [active]);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(ALL_CATEGORY)}
        className={`px-4 py-2.5 rounded-lg border text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
          active === ALL_CATEGORY
            ? "bg-slate-800 border-slate-800 text-white"
            : "bg-white border-slate-300 text-slate-800 hover:border-slate-400"
        }`}
      >
        {ALL_CATEGORY}
      </button>

      {visibleCategories.map((category) => {
        const isActive = category.title === active;

        return (
          <button
            key={category.id}
            onClick={() => onChange(category.title)}
            className={`px-4 py-2.5 rounded-lg border text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
              isActive
                ? "bg-slate-800 border-slate-800 text-white"
                : "bg-white border-slate-300 text-slate-800 hover:border-slate-400"
            }`}
          >
            {category.title}
          </button>
        );
      })}

      {results.length > MAX_CATEGORIES_ON_PAGE && (
        <Link
          href="/categories"
          className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium whitespace-nowrap text-slate-800 hover:border-slate-400 transition-colors"
        >
          Другое...
        </Link>
      )}
    </div>
  );
};
