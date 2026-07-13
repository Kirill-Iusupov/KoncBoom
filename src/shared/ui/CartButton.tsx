"use client"
import { useCartStore } from "@/src/entities/cart/model/cartStore";
import { Button } from "antd";
import Link from "next/link";

export const CartButton = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  return (
    <Link href="/cart">
    <Button className="h-11.75 bg-[#F59E0B] hover:text-[black] w-full border-none flex gap-2 items-center justify-center">
      <p className="font-bold">Корзина</p>
      <div className="bg-[red] text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">
       {totalQuantity}
      </div>
    </Button>
    </Link>
  );
};
