"use client";

import React from "react";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useCartStore } from "@/src/entities/cart/model/cartStore";
import { useModal } from "@/src/context/ModalProvider";
import { RemoveItemModal } from "@/src/features/cart/ui/RemoveItemModal"; // Убедись, что путь правильный

interface Props {
  product: any;
  i?: number;
}

export default function CardOrderingCart({ product }: Props) {
  const { incrementQuantity, decrementQuantity } = useCartStore();
  const { openModal } = useModal();


  // const displayPrice = Math.abs(Number(product.price));
  const displayPrice = Math.abs(Number(product.price || 0)) || 0;


  const handleDeleteClick = () => {
    openModal(<RemoveItemModal productId={product.id} productTitle={product.title} />);
  };
  

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 gap-4">

      <div className="w-20 h-20 shrink-0 bg-[#E6EEF2] rounded-xl overflow-hidden relative">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-[#1E2D42] text-lg font-medium truncate mb-1">
          {product.title}
        </h4>
        <p className="text-[#1E2D42] font-bold text-lg">
          {displayPrice} <span className="font-normal text-sm">сом</span>
        </p>
      </div>

      <div className="flex items-center gap-3 bg-[#E6EEF2] rounded-lg px-2 py-1">
        <button
          onClick={() => decrementQuantity(product.id)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors text-[#1E2D42]"
        >
          <MinusOutlined />
        </button>
        
        <span className="text-[#1E2D42] font-medium w-4 text-center">
          {product.quantity}
        </span>
        
        <button
          onClick={() => incrementQuantity(product.id)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors text-[#1E2D42]"
        >
          <PlusOutlined />
        </button>
      </div>

 
      <button
        onClick={handleDeleteClick}
        className="w-10 h-10 flex items-center justify-center shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
      >
        <DeleteOutlined className="text-xl" />
      </button>
    </div>
  );
}