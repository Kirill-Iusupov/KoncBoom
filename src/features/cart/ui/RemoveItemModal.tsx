import { useModal } from "@/src/context/ModalProvider";
import { useCartStore } from "@/src/entities/cart/model/cartStore";



interface Props {
  productId: number | string;
  productTitle: string;
}

export const RemoveItemModal = ({ productId, productTitle }: Props) => {
  const { closeModal } = useModal();
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleConfirm = () => {
    removeFromCart(productId);
    closeModal();
  };

  return (
    <div className="bg-[#E9EFF2] rounded-xl p-8 max-w-[400px] w-full text-center relative shadow-lg">
      <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-black">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 1L1 15M1.00001 1L15 15" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <h3 className="text-[#001D3D] text-xl font-bold mb-4 mt-2">
        Вы действительно хотите удалить товар?
      </h3>
      <p className="text-gray-700 mb-8">{productTitle}</p>

      <div className="flex justify-between gap-4">
        <button 
          onClick={closeModal}
          className="flex-1 bg-[#F59E0B] text-[#001D3D] font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Отмена
        </button>
        <button 
          onClick={handleConfirm}
          className="flex-1 bg-[#F59E0B] text-[#001D3D] font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Подтвердить
        </button>
      </div>
    </div>
  );
};