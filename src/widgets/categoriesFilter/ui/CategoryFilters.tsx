"use client";

import { useState } from "react";
import { categories } from "@/src/shared/mock/data";

export const CategoryFilters = () => {
  const defaultActive = categories[0].title;
  const [active, setActive] = useState(defaultActive);

  const handleClick = (category: string) => {
    setActive(category);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category.title === active;

        return (
          <button
            key={category.id}
            onClick={() => handleClick(category.title)}
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
