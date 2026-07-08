import { ItemFormat } from "@/src/shared/model/types";

interface IItemCardProps {
  item: ItemFormat;
}

export const ItemCard = ({ item }: IItemCardProps) => {
  console.log(item);
  return (
    <div className={`w-[calc(25%-15px)]  rounded-3xl flex flex-col border`}>
      <img src={item.image} alt={item.title} className="rounded-t-3xl" />
      <div className="flex px-4 items-center justify-between">
        <div>
          <p>{item.brand}</p>
          <p>{item.title}</p>
          <p>{item.price}c</p>
        </div>

        <button className="border rounded w-10 h-10">+</button>
      </div>
    </div>
  );
};
