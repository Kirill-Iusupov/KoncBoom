import { ShoppingOutlined } from "@ant-design/icons";
import { Button } from "antd";

export const CartButton = () => {
  return (
    <Button className="h-11.75! bg-[#F59E0B]! hover:text-[black]! w-full! hover:border-none! flex gap-2 items-center justify-center">
      <ShoppingOutlined />
      <p className='font-bold'>Корзина</p>
      <p className="">0</p>
    </Button>
  );
};
