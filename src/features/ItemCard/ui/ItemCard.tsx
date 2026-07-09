import { ItemFormat } from "@/src/shared/model/types";

interface IItemCardProps {
  item: ItemFormat;
}

export const ItemCard = ({ item }: IItemCardProps) => {
  return (
    <div
      className={`w-[calc(25%-15px)] overflow-hidden rounded-3xl flex flex-col border`}
    >
      <img src={item.image} alt={item.title} className="rounded-t-3xl " />
      <div className="flex p-4 items-center justify-between bg-[#E6EEF2] rounded-b-3xl">
        <div className="flex flex-col items-start">
          <p className="text-[#B0B0B0]">{item.brand}</p>
          <h4 className="text-[#1E2D42] text-[18px] font-medium max-w-[60%]">
            {item.title}
          </h4>

          <div className="flex items-center gap-0.5 text-[24px] text-[#1E2D42]">
            <p className="font-bold  ">{item.price}</p>
            <p className="font-normal">сом</p>
          </div>
        </div>

        <button className="rounded w-10 h-10 cursor-pointer border-[1px_1px_4px_1px] border-[#1E2D42] hover:scale-125">
          +
        </button>
      </div>
    </div>
  );
};
