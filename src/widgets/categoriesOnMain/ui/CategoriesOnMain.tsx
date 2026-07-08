import Link from "next/link";
import { categories } from "@/src/shared/mock/data";
import CategorieCard from "@/src/features/categoriesCard";

const CategoriesOnMain = () => {
  console.log("categories => ", categories);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-black">Категории</h3>
        </div>
        <button className="bg-[#F5F5F5] text-black py-2 px-4 rounded border-[1px_1px_4px_1px] border-[#1E2D42] p-4 cursor-pointer">
          <Link href={"/categories"}> Все категории</Link>
        </button>
      </div>
      <div className="flex gap-6 flex-wrap">
        {categories.map((cat) => (
          <CategorieCard item={cat} key={cat.id} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesOnMain;
