"use client";

import { IPromoCardProps } from "@/src/shared/model/types";
import Link from "next/link";

export const PromCard = ({
  eyebrow,
  title,
  description,
  discount,
}: IPromoCardProps) => {
  return (
    <div className="flex flex-col justify-between w-[calc(25%-15px)] max-w-sm rounded-xl bg-[#E6EEF2] overflow-hidden">
      <div className="p-5 text-[#1E2D42]">
        <span className="text-xs font-semibold tracking-wide text-red-600 uppercase">
          {eyebrow}
        </span>

        <h3 className="mt-1 text-2xl font-bold text-slate-900 leading-snug">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between bg-[#D3D3D3] px-5 py-4">
        <Link
          href={"/"}
          className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-slate-900 shadow-[0_3px_0_0_rgba(180,120,10,1)] transition-transform active:translate-y-[2px] active:shadow-[0_1px_0_0_rgba(180,120,10,1)]"
        >
          Перейти
        </Link>

        <span className="text-4xl font-extrabold text-red-600">
          -{discount}%
        </span>
      </div>

      {/* Вот тут будет таймер */}
    </div>
  );
};
