import { useCartStore } from "@/src/entities/cart/model/cartStore";
import { Product } from "@/src/shared/model/types";

interface IItemProps {
  item: Product;
}

export const ItemCard = ({ item }: IItemProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  const isItemInCart = cartItems.some((cartItem) => cartItem.id === item.id);
  const isOutOfStock = item.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(item);
  };

  const displayPrice = Math.abs(Number(item.price));

  return (
    <div className={`w-full md:w-[calc(25%-15px)] overflow-hidden rounded-3xl flex flex-col border transition-opacity duration-200 ${isOutOfStock ? 'opacity-60' : ''}`}>
      <div className="relative w-full aspect-square">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium bg-black/60 px-3 py-1 rounded-full text-sm">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 bg-[#E6EEF2] rounded-b-3xl effectively-disabled">
        <div>
          <p className="text-[#B0B0B0] text-sm">{item.brand}</p>
          <h4 className="text-[#1E2D42] text-[18px] font-medium truncate">
            {item.title}
          </h4>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-end gap-0.5 text-[24px] text-[#1E2D42]">
            <p className="font-bold">{displayPrice}</p>
            <p className="font-normal">сом</p>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`rounded-lg w-10 h-10 border border-[#1E2D42] flex items-center justify-center shrink-0 transition-all duration-200 
              ${isOutOfStock 
                ? 'border-gray-400 text-gray-400 bg-transparent cursor-not-allowed' 
                : 'cursor-pointer hover:scale-110'
              } 
              ${isItemInCart && !isOutOfStock ? 'bg-[#1E2D42] text-white' : ''}`
            }
          >
            {isOutOfStock ? (
              "✕" 
            ) : isItemInCart ? (
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                 <polyline points="20 6 9 17 4 12"></polyline>
               </svg>
            ) : (
              "+"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};