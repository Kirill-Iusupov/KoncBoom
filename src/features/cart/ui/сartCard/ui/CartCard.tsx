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

  const { incrementQuantity, decrementQuantity, setProductQuantity } =
    useCartStore();
  const { getProducts, products, isLoading } = useProductsStore();

  useEffect(() => {
    getProducts();
  }, []);

  const productPrice = Number(product.price) || 0;
  const productQuantity = Number(product.quantity) || 0;
  const { openModal } = useModal();


  const freshProductInfo = products?.results?.find(
    (p: any) => p.id === product.id,
  );


  const currentStock =
    freshProductInfo !== undefined
      ? Number(freshProductInfo.stock)
      : product.stock || 0;

  useEffect(() => {
    if (!isLoading && freshProductInfo !== undefined) {
      if (productQuantity > currentStock) {
        setProductQuantity(product.id, currentStock);
      }
    }
  }, [currentStock, productQuantity, isLoading, freshProductInfo, product.id]);

  const totalPrice = productPrice * productQuantity;
  const isMaxStockReached = productQuantity >= currentStock;

  const handleDeleteClick = () => {
    openModal(
      <RemoveItemModal productId={product.id} productTitle={product.title} />,
    );
  };

  return (
    <div className="relative w-full p-[.625rem] md:p-[20px] gap-[1rem] z-0 bg-[#E6EEF2] rounded-[12px]">
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
          </div>

          <div className="w-full flex justify-between md:items-end flex-col md:flex-row">
            <div>
              <div className="w-full flex gap-[.625rem] items-center">
                <div className="md:w-full flex justify-between items-center gap-[.225rem] md:gap-[.9688rem]">
                  <button
                    type="button"
                    onClick={() => decrementQuantity(product.id)}
                    className="w-[40px] h-[40px] md:w-[80px] md:h-[48px] p-0 border rounded-[6px] flex items-center justify-center bg-[#B0B0B0] border-t-[1px] border-r-[1px] border-b-[4px] border-l-[1px] cursor-pointer border-[#5E5E5E] hover:bg-[#5E5E5E] active:translate-y-[2px]"
                  >
                    <span className="pb-[.4375rem] font-light font-sans text-3xl ">
                      –
                    </span>
                  </button>

                  <div className="w-min flex items-center text-[20px] font-semibold justify-center rounded-[.625rem]">
                    <div className="relative w-full">
                      <input
                        type="number"
                        maxLength={2}
                        value={productQuantity}
                        readOnly
                        className="w-[50px] border-none text-center outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isMaxStockReached || isLoading}
                    onClick={() => incrementQuantity(product.id)}
                    className={`w-[40px] h-[40px] md:w-[80px] md:h-[48px] p-0 border rounded-[6px] flex items-center justify-center transition-all
                      border-t-[1px] border-r-[1px] border-b-[4px] border-l-[1px] 
                      ${
                        isMaxStockReached || isLoading
                          ? "bg-gray-400 border-gray-500 cursor-not-allowed opacity-50 active:translate-y-0"
                          : "bg-[#F59E0B] border-[#D97706] cursor-pointer hover:bg-[#D97706] active:translate-y-[2px]"
                      }`}
                  >
                    <span className="pb-[.4375rem] font-['AdobeClean-Regular'] text-3xl">
                      +
                    </span>
                  </button>
                </div>
              </div>

              {isMaxStockReached && !isLoading && currentStock > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Доступно максимум: {currentStock} шт.
                </p>
              )}
              {currentStock === 0 && !isLoading && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  Товар закончился на складе
                </p>
              )}
            </div>

            <div className="mt-[10px]">
              <p className="text-end text-xl md:text-[1.25rem] font-bold whitespace-nowrap">
                {totalPrice} <span className="underline">с</span>
              </p>
              <p className="text-end text-[#808080] text-[14px] text-grey_second whitespace-nowrap">
                {productPrice} <span className="underline">с</span> за шт.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDeleteClick}
        className="absolute bottom-[20px] top-[20px] right-[20px] 
                   bg-[#F59E0B] border-t-[1px] border-r-[1px] border-b-[4px] border-l-[1px] border-[#D97706]
                   rounded-md md:w-[100px] h-[48px] px-5 cursor-pointer
                  transition-all group hover:bg-[#D97706] active:translate-y-[2px] "
      >
        <DeleteOutlined className="pt-1 text-[25px]" />
      </button>
    </div>
  );
}
