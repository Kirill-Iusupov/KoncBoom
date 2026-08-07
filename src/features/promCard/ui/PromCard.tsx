"use client";

import { Product } from "@/src/shared/model/types";
import { PromoTimer } from "../../promoTimer";

interface IPromoItemProps {
  item: Product;
}

export const PromCard = ({ item }: IPromoItemProps) => {
  const { promoInfo } = item;

  return (
    <div className="relative flex flex-col justify-between w-full md:w-[calc(25%-15px)] rounded-2xl bg-white border border-brand-border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(16,25,42,0.18)]">
      <span className="absolute top-4 right-4 font-num font-semibold text-xs bg-brand-orange text-white px-2.5 py-1 rounded-md">
        −{promoInfo.discount}%
      </span>

      <div className="p-5 text-brand-ink">
        <span className="text-xs font-semibold tracking-wide text-brand-orange-dark uppercase">
          {promoInfo.eyebrow}
        </span>

        <h3 className="mt-1.5 text-xl font-bold text-brand-ink leading-snug pr-14">
          {promoInfo.title}
        </h3>

        <p className="mt-2 text-sm text-brand-muted leading-relaxed">
          {promoInfo.description}
        </p>
        <PromoTimer start={promoInfo.starts_at} end={promoInfo.ends_at} />
      </div>
    </div>
  );
};
