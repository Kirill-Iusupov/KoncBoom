"use client";

import { MainPageButton } from "@/src/shared/ui/MainPageButton";
import ItemCard from "@/src/features/ItemCard";
import { useProductsStore } from "@/src/entities/catalog/model/store";

const Discounts = () => {
  const { products, isLoading } = useProductsStore();
  const { results } = products;

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-8 mb-20">
      <div className="flex gap-5 items-center flex-wrap">
        {results
          ?.filter(
            (item) => item.promoInfo?.promo || item.promoInfo?.discount > 0,
          )
          ?.slice(0, 4)
          ?.map((item) => (
            <ItemCard item={item} key={item.id} />
          ))}
      </div>
    </div>
  );
};

export default Discounts;
