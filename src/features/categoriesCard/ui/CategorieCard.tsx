import { CategoriesResult } from "@/src/shared/model/types";

import Link from "next/link";

interface ICatProps {
  item: CategoriesResult;
}

const CategorieCard = ({ item }: ICatProps) => {
  
  return (
    <Link
      href={`/catalog/?category=${item.title}`}
      className="w-[calc((100%/2)-20px)] md:w-[calc((100%/6)-20px)] h-50 rounded-2xl bg-[#E6EEF2] flex flex-col items-center justify-center
      hover:bg-[linear-gradient(124.72deg,rgba(59,130,246,0.2)_4.86%,rgba(128,176,255,0.5)_50.2%,rgba(30,45,66,0.8)_100%)] hover:shadow-[7px_4px_15px_0px_#00000040_inset,-10px_-10px_15px_0px_#00000040_inset,1px_4px_7px_0px_#0000004D]"
    >
      {item.icon && (
        <img
          src={item.icon}
          alt={item.description || item.title}
          className="w-[60px] h-[60px] object-contain"
        />
      )}
      <strong>{item.title}</strong>
      <p>{item.count} товаров</p>
    </Link>
  );
};

export default CategorieCard;
