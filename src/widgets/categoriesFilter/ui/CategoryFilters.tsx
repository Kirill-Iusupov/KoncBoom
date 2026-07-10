"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "../model/store";

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

  // как только категории подгрузились, а активная ещё не выбрана — выставляем первую по умолчанию
  useEffect(() => {
    if (results.length > 0 && !active) {
      onChange(results[0].title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  return (
    <div className="flex flex-wrap gap-2">
      {results.map((category) => {
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
    </div>
  );
};
