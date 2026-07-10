// import { ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";

export const CartButton = () => {
  return (
    <Link
      href="/cart"
      className="h-11.75 bg-[#F59E0B] hover:bg-[#e08c05] w-full rounded-lg flex items-center justify-center gap-2 px-4 transition-colors"
    >
      {/* <ShoppingCartOutlined className="text-[#1E2D42]" size={22} /> */}

      <p className="font-bold text-[#1E2D42]">Корзина</p>

      <div className="bg-red-600 text-white font-bold text-sm rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
        0
      </div>
    </Link>
  );
};
