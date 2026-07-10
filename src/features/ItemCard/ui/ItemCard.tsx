import { useCartStore } from "@/src/entities/cart/model/cartStore";
import { Product } from "@/src/shared/model/types";

interface IItemProps {
  item: Product;
}

export const ItemCard = ({ item }: IItemProps) => {

  
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  const isItemInCart = cartItems.some((cartItem) => cartItem.id === item.id);

  const handleAddToCart = () => {
    addToCart(item);
  };


  const displayPrice = Math.abs(Number(item.price));

  return (
    <div className="w-[calc(25%-15px)] overflow-hidden rounded-3xl flex flex-col border">
      <div className="relative w-full aspect-square">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 p-4 bg-[#E6EEF2] rounded-b-3xl">
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
            className={`rounded-lg w-10 h-10 border border-[#1E2D42] cursor-pointer hover:scale-110 transition-colors duration-200 flex items-center justify-center shrink-0 
              ${isItemInCart ? 'bg-[#1E2D42] text-white' : 'bg-transparent text-[#1E2D42]'}`
            }
          >
            
            {isItemInCart ? (
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
