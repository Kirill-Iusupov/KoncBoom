"use client";

import { MainPageButton } from "@/src/shared/ui/MainPageButton";
import { PromCard } from "@/src/features/promCard/ui/PromCard";
import { useProductsStore } from "@/src/entities/catalog/model/store";
import EmptyPromos from "@/src/features/emptyPromos";
import { usePathname } from "next/navigation";
import { Product } from "@/src/shared/model/types";

const PromsOnMain = () => {
  const pathname = usePathname();
  const { products } = useProductsStore();

  const { results } = products;

  const promoItems = results.filter(
    (e) => e.promoInfo.promo || e.promoInfo.conditional,
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        {pathname !== "/promotions" ? (
          <>
            <div>
              <h3 className="text-[24px] font-bold text-black">Акции</h3>
              <p>Актуальные предложения — только ограниченное время</p>
            </div>

            <MainPageButton title="Смотреть все акции" url="promotions" />
          </>
        ) : null}
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
