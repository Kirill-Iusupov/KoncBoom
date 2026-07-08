import { MainPageButton } from "@/src/shared/ui/MainPageButton";
import { items } from "@/src/shared/mock/data";
import { popularItems } from "@/src/shared/api/api";
import ItemCard from "@/src/features/ItemCard";

const Popular = () => {
  console.log(items);
  return (
    <div className="flex flex-col gap-8 mb-20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-black">Популярное</h3>
        </div>
        <MainPageButton url="catalog" title="Все товары" />
      </div>
      <div className="flex gap-5 items-center flex-wrap">
        {popularItems.slice(4).map((item) => (
          <ItemCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default Popular;
