import { Product } from "@/src/shared/model/types";

interface IItemProps {
  item: Product;
}

export const ItemCard = ({ item }: IItemProps) => {
  return (
    <div className="w-[calc(25%-15px)] overflow-hidden rounded-3xl flex flex-col border">
      <div className="relative w-full aspect-square">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 p-4 bg-[#E6EEF2] rounded-b-3xl">
        <div>
          <p className="text-[#B0B0B0] text-sm">{item.brand}</p>
          <h4 className="text-[#1E2D42] text-[18px] font-medium truncate">
            {item.title}
          </h4>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-end gap-0.5 text-[24px] text-[#1E2D42]">
            <p className="font-bold">{item.price}</p>
            <p className="font-normal">сом</p>
          </div>

          <button className="rounded-lg w-10 h-10 border border-[#1E2D42] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center shrink-0">
            +
          </button>
        </div>
      </div>
    </div>
  );
};
