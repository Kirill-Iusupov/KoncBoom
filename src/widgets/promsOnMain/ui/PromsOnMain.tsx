"use client";

import { MainPageButton } from "@/src/shared/ui/MainPageButton";
import { PromCard } from "@/src/features/promCard/ui/PromCard";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import EmptyPromos from "@/src/features/emptyPromos";
import { usePathname } from "next/navigation";

const PromsOnMain = () => {
  const pathname = usePathname();
  const { products } = useProductsStore();

  const { results } = products;

  const promoItems = results.filter((e) => e.promoInfo.promo);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[24px] font-bold text-black">Акции</h3>
          <p>Актуальные предложения — только ограниченное время</p>
        </div>
       {pathname === 'promotions' &&  <MainPageButton title="Смотреть все акции" url="promotions" />}
      </div>
      {promoItems.length <= 0 ? (
        <EmptyPromos />
      ) : (
        <div className="flex flex-wrap gap-5 mt-10">
          {promoItems.slice(0, 4).map((item, idx) => (
            <PromCard key={idx} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromsOnMain;
