"use client";

import { useState } from "react";
import CustomPagination from "@/src/shared/ui/CustomPagination";
import { Wrapper } from "@/src/shared/ui/Wrapper";
import Heading from "@/src/widgets/heading";

import { useCartStore } from "@/src/entities/cart/model/cartStore";
import { useModal } from "@/src/context/ModalProvider";
import MakingOrdering from "@/src/widgets/checkout/ui/MakingOrdering";
import { ClearCartModal } from "@/src/features/cart/ui/CartCard/ClearCartModal";
import CartCard from "@/src/features/cart/ui/CartCard/ui/CartCard";

const PAGE_SIZE = 4; 

const Cart = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { items, totalQuantity, totalPrice, previewData, isError, isLoading } = useCartStore();
  const { openModal } = useModal();

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentItems = items.slice(startIndex, startIndex + PAGE_SIZE);

  const handleCheckout = () => {
    openModal(<MakingOrdering />);
  };

  // Показываем цену сервера. Если сервер недоступен, берем локальную цену из totalPrice.
  const displayTotal = isError || !previewData ? totalPrice : previewData.total;

  return (
    <>
      <Heading />
      <Wrapper>
        <div className="flex justify-end mb-[20px] mt-[20px]">
          <button
            onClick={() => openModal(<ClearCartModal />)}
            disabled={items.length === 0}
            className="px-[15px] cursor-pointer text-white bg-[#5E5E5E] h-[36px] rounded-[24px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Очистить всю корзину
          </button>
        </div>

        {items.length === 0 ? (
          <div className="w-full flex justify-center items-center min-h-[400px]">
            <p className="text-2xl font-bold text-gray-400">Ваша корзина пуста</p>
          </div>
        ) : (
          <div className="relative min-h-[600px] flex flex-col md:flex-row gap-[50px] justify-between">
            
            <div className="flex w-full mb-[45px] flex-col gap-[15px] md:gap-[40px]">
              {currentItems.map((product) => (
                <div key={product.id}>
                  <CartCard product={product} /> 
                </div>
              ))}
              
              {items.length > PAGE_SIZE && (
                <CustomPagination
                  total={items.length}
                  currentPage={currentPage}
                  pageSize={PAGE_SIZE}
                  onChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>

            <div className="min-w-[326px] bg-[#E6EEF2] rounded-[12px] p-[20px] sticky top-[40px] h-fit hidden md:flex flex-col gap-[20px] items-center">
              <p className="text-center font-bold text-[28px]">
                Выбранные товары
              </p>

              <div className="w-full flex px-[26px] flex-col gap-[20px]">
                <p className="font-bold">Итог</p>
                <div className="w-full flex justify-between items-center gap-[8px]">
                  <p className="whitespace-nowrap">Сумма:</p>
                  <p className="whitespace-nowrap">{displayTotal} сом</p>
                </div>
                {previewData?.discount_total && Number(previewData.discount_total) > 0 && !isError && (
                  <div className="w-full flex justify-between items-center gap-[8px] text-green-600">
                    <p className="whitespace-nowrap">Скидка:</p>
                    <p className="whitespace-nowrap">-{previewData.discount_total} сом</p>
                  </div>
                )}
                <div className="w-full flex justify-between items-center gap-[8px]">
                  <p className="whitespace-nowrap">Количество:</p>
                  <p className="whitespace-nowrap">{totalQuantity} шт</p>
                </div>
              </div>

              <div className="w-full flex justify-between font-semibold text-2xl items-center gap-[8px]">
                <p className="whitespace-nowrap">Итого:</p>
                <p className="whitespace-nowrap text-[#D97706]">
                  {displayTotal} сом
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full cursor-pointer py-[12px] text-[18px] rounded-[10px] bg-[#16A34A] active:translate-y-[2px] disabled:opacity-50 border-none text-white hover:bg-green-700 transition-colors"
              >
                {isLoading ? 'Пересчет...' : 'Продолжить'}
              </button>
            </div>

            <div className="md:hidden fixed right-0 left-0 bottom-0 w-full flex gap-4 bg-white p-5 shadow-[0_0_.625rem_0_#00000014] z-50">
              <div className="flex-1">
                <div className="w-full flex items-center gap-[8px]">
                  <p className="whitespace-nowrap text-sm">Количество: {totalQuantity} шт</p>
                </div>
                <div className="w-full flex justify-between font-semibold text-xl items-center gap-[8px]">
                  <p className="whitespace-nowrap">Итого:</p>
                  <p className="whitespace-nowrap text-[#D97706]">
                    {displayTotal} сом
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-[140px] shrink-0 rounded-[12px] bg-[#16A34A] active:translate-y-[2px] border-none text-white font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Продолжить
              </button>
            </div>
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default Cart;