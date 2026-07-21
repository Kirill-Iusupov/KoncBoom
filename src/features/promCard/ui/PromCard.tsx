"use client";

import { Product } from "@/src/shared/model/types";
import { PromoTimer } from "../../promoTimer";

interface IPromoItemProps {
  item: Product;
}

export const PromCard = ({ item }: IPromoItemProps) => {
  const { promoInfo } = item;

  return (
    <div className="flex flex-col justify-between w-full md:w-[calc(25%-15px)] rounded-xl bg-[#E6EEF2] overflow-hidden">
      <div className="p-5 text-[#1E2D42]">
        <span className="text-xs font-semibold tracking-wide text-red-600 uppercase">
          {promoInfo.eyebrow}
        </span>

        <h3 className="mt-1 text-2xl font-bold text-slate-900 leading-snug">
          {promoInfo.title}
        </h3>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {promoInfo.description}
        </p>
        <PromoTimer start={promoInfo.starts_at} end={promoInfo.ends_at} />
      </div>

      <div className="flex items-center justify-center bg-[#D3D3D3] px-5 py-4">
        <span className="text-4xl font-extrabold text-red-600">
          -{promoInfo.discount}%
        </span>
      </div>
    </div>
  );
};
