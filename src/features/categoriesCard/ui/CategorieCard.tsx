import { CategoriesResult } from "@/src/shared/model/types";

import Link from "next/link";

interface ICatProps {
  item: CategoriesResult;
}

const CategorieCard = ({ item }: ICatProps) => {
  
  return (
    <Link
      href={`/catalog/?category=${item.title}`}
      className="w-[calc((100%/2)-20px)] md:w-[calc((100%/6)-20px)] h-50 rounded-2xl bg-white border border-brand-border flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:border-brand-blue/50 hover:-translate-y-1 hover:shadow-[0_14px_28px_-10px_rgba(16,25,42,0.16)]"
    >
      {item.icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-blue-tint flex items-center justify-center">
          <img
            src={item.icon}
            alt={item.description || item.title}
            className="w-8 h-8 object-contain"
          />
        </div>
      )}
      <strong className="text-brand-ink text-center px-2">{item.title}</strong>
      <p className="text-brand-muted text-sm">{item.count} товаров</p>
    </Link>
  );
};

export default CategorieCard;
