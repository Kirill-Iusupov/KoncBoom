"use client";

import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useModal } from "@/src/context/ModalProvider";

export default function CompletOrder() {
  const { closeModal } = useModal();

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className="bg-[#E9EFF2] rounded-xl p-8 max-w-[450px] w-full text-center relative shadow-2xl">
 
      <button 
        onClick={handleClose} 
        className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 1L1 15M1.00001 1L15 15" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <div className="flex justify-center mb-6">
        <CheckCircleOutlined className="text-[#001D3D] text-6xl" />
      </div>

      <h3 className="text-[#001D3D] text-2xl font-extrabold mb-3">
        Заказ успешно оформлен!
      </h3>
      <p className="text-gray-600 mb-8 text-lg">
        Спасибо за ваш заказ. В ближайшее время мы свяжемся с вами для подтверждения.
      </p>

      <button 
        onClick={handleClose}
        className="w-full bg-[#F59E0B] text-[#001D3D] font-bold text-lg py-4 rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
      >
        Отлично
      </button>
    </div>
  );
}