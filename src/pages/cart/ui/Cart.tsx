"use client";
import CartCard from "@/src/features/cart/ui/сartCard/ui/CartCard";
import CustomPagination from "@/src/shared/ui/CustomPagination";
import { Wrapper } from "@/src/shared/ui/Wrapper";
import Heading from "@/src/widgets/heading";
import { useState } from "react";

export type TypeCartCard = {
  name: string;
  brand: string;
  img: string;
  quantity: number;
  price: number;
  extraId: number;
};

type TypeBasket = {
  products: TypeCartCard[];
  total_quantity: number;
  price: number;
};

const Cart = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const basket: TypeBasket = {
    products: [
      {
        name: "Ручка шариковая Pilot G-2",
        brand: "Pilot",
        img: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
        quantity: 1,
        price: 67867,
        extraId: 45,
      },
      {
        name: "Ручка шариковая Pilot G-2",
        brand: "Pilot",
        img: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
        quantity: 1,
        price: 67867,
        extraId: 45,
      },
      {
        name: "Ручка шариковая Pilot G-2",
        brand: "Pilot",
        img: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
        quantity: 1,
        price: 67867,
        extraId: 45,
      },
    ],
    total_quantity: 34534,
    price: 43657,
  };

  return (
    <>
      <Heading />
      <Wrapper>
        <div className="flex justify-end mb-[20px] mt-[20px]">
          <button
            // onClick={() => openModal(<ConfirmClearBasket />)}
            className="px-[15px] cursor-pointer text-white bg-[#5E5E5E] h-[36px] rounded-[24px]  active:translate-y-[2px]"
          >
            Отчистить всю корзину
          </button>
        </div>

        <div className="relative min-h-[600px] flex flex-col md:flex-row gap-[50px] justify-between">
          <div className="flex w-full mb-[45px] flex-col gap-[15px] md:gap-[40px]">
            {basket.products.map((e: TypeCartCard) => (
              <div key={e.extraId}>
                <CartCard product={e} />
              </div>
            ))}
            <CustomPagination
              total={basket.products.length}
              currentPage={currentPage}
              pageSize={4}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>

          <div className="min-w-[326px] bg-[#E6EEF2] rounded-[12px] p-[20px] sticky top-[40px] h-fit hidden md:flex flex-col gap-[20px] items-center">
            <p className="text-center font-bold text-[28px]">
              Выбранные товары
            </p>

            <div className="w-full flex px-[26px] flex-col gap-[20px]">
              <p className="font-bold">Итог</p>
              <div className="w-full flex justify-between items-center gap-[8px]">
                <p className="whitespace-nowrap">Сумма:</p>
                <p className="whitespace-nowrap">{basket.total_quantity} сом</p>
              </div>
              <div className="w-full flex justify-between items-center gap-[8px]">
                <p className="whitespace-nowrap">Доставка:</p>
                <p className="whitespace-nowrap">{basket.total_quantity} сом</p>
              </div>
            </div>

            <div className="w-full flex justify-between font-semibold text-2xl items-center gap-[8px]">
              <p className="whitespace-nowrap">Итого:</p>
              <p className="whitespace-nowrap text-[#D97706]">
                {basket.price} сом
              </p>
            </div>

            <button
              // onClick={() => openModal(<MakingOrdering />)}
              className="w-full cursor-pointer py-[12px] text-[18px] rounded-[10px] bg-[#16A34A]  active:translate-y-[2px] border-none text-white"
            >
              Продолжить
            </button>
          </div>

          <div className="md:hidden fixed right-0 left-0 bottom-0 w-full flex gap-4 bg-white p-5 shadow-[0_0_.625rem_0_#00000014] z-50">
            <div>
              <div className="w-full flex items-center gap-[8px]">
                <p className="whitespace-nowrap">Количество:</p>
                <p className="whitespace-nowrap">{basket.total_quantity}шт</p>
              </div>
              <div className="w-full flex justify-between font-semibold text-2xl items-center gap-[8px]">
                <p className="whitespace-nowrap">Итого:</p>
                <p className="whitespace-nowrap text-[#D97706]">
                  {basket.price} сом
                </p>
              </div>
            </div>
            <button
              // onClick={() => openModal(<MakingOrdering />)}
              className="w-full rounded-[12px] bg-[#16A34A]  active:translate-y-[2px] border-none text-white"
            >
              Продолжить
            </button>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default Cart;
