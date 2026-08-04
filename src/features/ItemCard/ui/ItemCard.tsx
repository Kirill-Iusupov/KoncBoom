import { useEffect, useState } from "react";
import { useCartStore } from "@/src/entities/cart/model/cartStore";
import { Product } from "@/src/shared/model/types";

// Вспомогательный хук для живого таймера акции
const useCountdown = (targetDate?: Date | string) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formatted = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");

      setTimeLeft(formatted);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

interface IItemProps {
  item: Product;
}

export const ItemCard = ({ item }: IItemProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  const isItemInCart = cartItems.some((cartItem) => cartItem.id === item.id);
  const isOutOfStock = item.stock === 0;

  // Актуальная цена всегда берется из final_price
  const displayPrice = Math.abs(Number(item.final_price));
  // Старая цена (до скидки) берется из price
  const oldPrice = Math.abs(Number(item.price));

  // Акция активна, если есть флаг promo и итоговая цена меньше обычной
  const isPromo = Boolean(item.promoInfo?.promo && displayPrice < oldPrice);

  // Получаем строку времени до конца акции
  const timeLeft = useCountdown(isPromo ? item.promoInfo?.ends_at : undefined);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: прокидываем final_price в ключ price
    addToCart({
      ...item,
      price: item.final_price,
    });
  };

  return (
    <div
      className={`w-full md:w-[calc(25%-15px)] overflow-hidden rounded-3xl flex flex-col border border-brand-border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(16,25,42,0.16)] ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      <div className="relative w-full aspect-square">
        {/* Бейдж скидки в левом верхнем углу */}
        {isPromo && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-brand-green text-white font-semibold text-xs px-2.5 py-1 rounded-md z-10 shadow-sm">
            СКИДКА
          </div>
        )}
        <div
          className="absolute inset-0 w-full h-full object-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        />
        {/* <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <span className="text-white font-medium bg-black/60 px-3 py-1 rounded-full text-sm">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 bg-white rounded-b-3xl">
        <div>
          <p className="text-brand-muted text-sm">{item.brand}</p>
          <h4 className="text-brand-ink text-[18px] font-medium truncate">
            {item.title}
          </h4>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 flex-wrap text-brand-ink">
            {/* Старая перечеркнутая цена (показываем только если есть скидка) */}
            {isPromo && (
              <span className="font-num text-sm text-brand-muted line-through font-normal">
                {oldPrice} сом
              </span>
            )}

            {/* Текущая цена (всегда отображаем final_price) */}
            <div className="flex items-baseline gap-0.5 text-[22px] font-num">
              <span className="font-semibold">{displayPrice}</span>
              <span className="font-normal text-[16px]">сом</span>
            </div>

            {/* Красный таймер обратного отсчета */}
            {isPromo && timeLeft && (
              <span className="font-num text-[13px] text-brand-orange-dark font-medium tracking-tight ml-0.5">
                {timeLeft}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`rounded-full w-10 h-10 border border-brand-ink/20 flex items-center justify-center shrink-0 transition-all duration-200 
              ${
                isOutOfStock
                  ? "border-gray-300 text-gray-400 bg-transparent cursor-not-allowed"
                  : "cursor-pointer hover:scale-110 hover:border-brand-ink"
              } 
              ${isItemInCart && !isOutOfStock ? "bg-brand-ink border-brand-ink text-white" : ""}`}
          >
            {isOutOfStock ? (
              "✕"
            ) : isItemInCart ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
