"use client";
import { useEffect } from "react";
import { useModal } from "@/src/context/ModalProvider";
import { useCartStore } from "@/src/entities/cart/model/cartStore";
import { DeleteOutlined } from "@ant-design/icons";
import { RemoveItemModal } from "../../RemoveItemModal";
import { useProductsStore } from "@/src/entities/catalog/model/store";

type TypeCartCardProps = {
  product: any;
};

export default function CartCard({ product }: TypeCartCardProps) {
  const { incrementQuantity, decrementQuantity, previewData, isError } = useCartStore();
  const { getProducts, products, isLoading } = useProductsStore();
  const { openModal } = useModal();

  useEffect(() => {
    getProducts();
  }, []);

  // Ищем данные об этом товаре с сервера
  const serverProduct = previewData?.items.find(
    (item) => item.product_id === product.id
  );

  const productQuantity = Number(product.quantity) || 0;
  
  // Если сервер ответил ошибкой 500, используем старые локальные цены
  const fallbackLineTotal = (Number(product.price) * productQuantity).toFixed(2);
  const displayLineTotal = isError || !serverProduct ? fallbackLineTotal : serverProduct.line_total;
  const displayUnitPrice = isError || !serverProduct ? product.price : serverProduct.final_unit_price;

  // Проверяем наличие на складе
  const freshProductInfo = products?.results?.find((p: any) => p.id === product.id);
  const currentStock = serverProduct 
    ? serverProduct.stock 
    : (freshProductInfo !== undefined ? Number(freshProductInfo.stock) : (product.stock || 0));

  const isStockOk = serverProduct ? serverProduct.stock_ok : true;
  const isMaxStockReached = productQuantity >= currentStock;

  const handleDeleteClick = () => {
    openModal(
      <RemoveItemModal productId={product.id} productTitle={product.title} />
    );
  };

  return (
    <div className={`relative w-full p-[.625rem] md:p-[20px] gap-[1rem] z-0 bg-[#E6EEF2] rounded-[12px] transition-all border-2 
      ${!isStockOk ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
    >
      <div className="w-full flex gap-[20px] flex-row">
        <div className="w-[140px] h-[140px] md:h-[120px] flex items-center justify-center rounded-[.625rem] overflow-hidden bg-gray-50 relative">
          <img
            src={product.image}
            alt={product.name || product.title}
            className="hidden md:block object-cover w-full h-full rounded-[.8125rem]"
          />
          <img
            src={product.image}
            alt={product.name || product.title}
            className="block md:hidden object-cover w-full h-full rounded-[.8125rem]"
          />
        </div>

        <div className="w-full flex flex-col justify-between">
          <div>
            <p className="text-[1rem] md:text-[18px] font-medium">
              {product.name || product.title}
            </p>
            <p className="uppercase text-[16px] pb-[.375rem]">
              {product.brand}
            </p>
            
            {/* Название примененной акции */}
            {serverProduct?.applied_promo && (
              <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                Акция: {serverProduct.applied_promo.title}
              </span>
            )}
            
            {/* Подсказка, если не хватает до акции */}
            {serverProduct?.hint && (
              <p className="text-sm text-[#D97706] mt-1 font-medium">
                {serverProduct.hint}
              </p>
            )}
          </div>

          <div className="w-full flex justify-between md:items-end flex-col md:flex-row mt-4">
            <div>
              <div className="w-full flex gap-[.625rem] items-center">
                <div className="w-full flex justify-between gap-10 ">
                  <div className="md:w-full flex justify-between items-center gap-[.225rem] md:gap-[.9688rem]">
                    <button
                      type="button"
                      onClick={() => {
                        decrementQuantity(product.id);
                      }}
                      className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] p-[5px] rounded-[10px] flex items-center justify-center bg-[#B0B0B0] cursor-pointer hover:bg-[#5E5E5E] active:translate-y-[2px]"
                    >
                      <span className="pb-[.4375rem] font-light font-sans text-3xl">–</span>
                    </button>

                    <div className="w-min flex items-center text-[20px] font-semibold justify-center rounded-[.625rem]">
                      <div className="relative w-full">
                        <input
                          type="number"
                          maxLength={2}
                          value={productQuantity}
                          readOnly
                          className="w-[50px] bg-transparent border-none text-center outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isMaxStockReached}
                      onClick={() => {
                        incrementQuantity(product.id);
                      }}
                      className={`w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-[10px] flex items-center justify-center transition-all
                      ${isMaxStockReached
                          ? "bg-gray-400 border-gray-500 cursor-not-allowed opacity-50 active:translate-y-0"
                          : "bg-[#F59E0B] border-[#D97706] cursor-pointer hover:bg-[#D97706] active:translate-y-[2px]"
                        }`}
                    >
                      <span className="pb-[.4375rem] font-['AdobeClean-Regular'] text-3xl">+</span>
                    </button>
                  </div>



                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="md:absolute bottom-[68px] md:bottom-[20px] md:top-[20px] right-[20px] rounded-[10px] bg-[#F59E0B] md:w-[50px] md:h-[48px] w-[40px] h-[40px] px-2 cursor-pointer transition-all group hover:bg-[#D97706] active:translate-y-[2px]"
                  >
                    <DeleteOutlined className="pt-1 text-[20px]" />
                  </button>
                </div>
              </div>

              {!isStockOk && (
                <p className="text-xs text-red-600 font-medium mt-2">
                  Остаток на складе: {currentStock} шт.
                </p>
              )}
            </div>

            <div className="mt-[10px]">
              <p className="text-end text-xl md:text-[1.25rem] font-bold whitespace-nowrap">
                {displayLineTotal} <span className="underline">с</span>
              </p>
              <div className="flex flex-col items-end">
                {serverProduct?.has_discount && !isError && (
                  <span className="text-xs line-through text-gray-400">
                    {serverProduct.unit_price} с
                  </span>
                )}
                <p className="text-end text-[#808080] text-[14px] text-grey_second whitespace-nowrap">
                  {displayUnitPrice} <span className="underline">с</span> за шт.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
