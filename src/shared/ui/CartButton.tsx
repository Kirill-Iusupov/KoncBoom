"use client";
import { useCartStore } from "@/src/entities/cart/model/cartStore";
import { Button } from "antd";
import Link from "next/link";

export const CartButton = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  return (
    <Link href="/cart">
      <Button className="h-11.75 !rounded-full bg-brand-orange hover:!bg-brand-orange-dark hover:!text-white w-full border-none flex gap-2.5 items-center justify-center px-5!">
        <p className="font-semibold text-white">Корзина</p>
        <div className="bg-white/25 text-white font-num font-semibold text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
          {totalQuantity}
        </div>
      </Button>
    </Link>
  );
};
