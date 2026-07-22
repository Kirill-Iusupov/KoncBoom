"use client";

import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

import { useModal } from "@/src/context/ModalProvider";
import { useCartStore } from "@/src/entities/cart/model/cartStore";
import CompletOrder from "@/src/features/cart/ui/CompletOrder";
import CardOrderingCart from "@/src/features/cart/ui/CardOrderingCart";
import { api } from "@/src/shared/api/api";

type MakingOrderingProps = {
  singleProduct?: any;
};

export default function MakingOrdering({ singleProduct }: MakingOrderingProps) {
  const { closeModal, openModal } = useModal();
  const { items, totalPrice, clearCart } = useCartStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [client, setClient] = useState(false);
  const [loading, setLoading] = useState(false);

  const [idempotencyKey] = useState(() => crypto.randomUUID());

const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value;

  let rawDigits = value.replace(/\D/g, "");

  if (rawDigits.startsWith("996")) {
    rawDigits = rawDigits.slice(3);
  }

  rawDigits = rawDigits.slice(0, 9);


  if (!rawDigits) {
    setPhone("");
    return;
  }

  const formattedDigits = rawDigits.replace(/(\d{3})(?=\d)/g, "$1 ");
  setPhone(`+996 ${formattedDigits}`);
};

  useEffect(() => {
    const savedName = localStorage.getItem("clientName");
    const savedPhone = localStorage.getItem("clientPhone");
    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
    setClient(true);
  }, []);

  const ClickAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !phone) {
      alert("Пожалуйста, заполните имя и телефон!");
      setLoading(false);
      return;
    }

    const productsToSend = singleProduct
      ? [{ id: singleProduct.id, quantity: 1 }]
      : items;

    if (!productsToSend.length) {
      alert("Корзина пуста!");
      setLoading(false);
      return;
    }

    const body = {
      idempotency_key: idempotencyKey,
      guest_name: name,
      guest_phone: phone,
      guest_address: address || "Самовывоз",
      comment: comment,
      items: productsToSend.map((item: any) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await api.post("/orders/", body);

      localStorage.setItem("clientName", name);
      localStorage.setItem("clientPhone", phone);

      if (!singleProduct) clearCart();

      openModal(<CompletOrder />);
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 200) {
        openModal(<CompletOrder />);
      } else {
        const errorDetail =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          JSON.stringify(err.response?.data);
        alert(`Ошибка сервера (${err.response?.status}): ${errorDetail}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!client) return null;

  return (
    <div className="relative w-[100%] rounded-[10px] bg-white container shadow-[0_0_10px_0_#00000014]">
      <div className="flex justify-end">
        <button
          onClick={closeModal}
          className="absolute bg-transparent right-[20px] top-[20px] rotate-45 text-gray-500 text-4xl"
        >
          +
        </button>
      </div>

      <div className="w-full flex flex-col md:flex-row">
        {!singleProduct && (
          <div className="w-full hidden md:flex flex-col justify-between py-[80px] px-[60px] rounded-[10px] bg-[#F2F2F2]">
            <div className="h-[400px] scroll_style overflow-y-scroll pr-5 flex flex-col gap-5">
              {items.length ? (
                items.map((product, i) => (
                  <CardOrderingCart key={product.id} product={product} i={i} />
                ))
              ) : (
                <p>Корзина пуста</p>
              )}
            </div>

            <div className="w-full text-lg flex gap-4 flex-col pt-[45px]">
              <div className="w-full flex items-center gap-2">
                <p className="whitespace-nowrap">Итого</p>
                <p className="text-black overflow-hidden whitespace-nowrap tracking-[5px]">
                  .................................
                </p>
                <p className="text-[18px] whitespace-nowrap">
                  {totalPrice} сом
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full px-[20px] md:px-[80px] py-[90px] rounded-[10px] shadow-[0_0_10px_0_#00000014]">
          <p className="mb-[60px] text-center text-3xl font-extrabold">
            Оформление заказа
          </p>
          <form onSubmit={ClickAddOrder}>
            <div className="w-full flex flex-col gap-5">
              <input
                className="w-full rounded-[10px] border-gray-300 border-2 px-5 py-4 outline-none focus:border-black"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
              />
              <input
                className="w-full rounded-[10px] border-gray-300 border-2 px-5 py-4 outline-none focus:border-black"
                placeholder="+996 500 500 500"
                value={phone}
                onChange={handlePhoneChange}
                type="tel"
                inputMode="tel"
                required
              />
              <input
                className="w-full rounded-[10px] border-gray-300 border-2 px-5 py-4 outline-none focus:border-black"
                placeholder="Адрес доставки (необязательно)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
              />
              <textarea
                className="w-full rounded-[10px] border-gray-300 border-2 px-5 py-4 outline-none focus:border-black resize-none"
                placeholder="Комментарий к заказу (необязательно)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-[60px] rounded-[10px] bg-[#F59E0B] cursor-pointer hover:bg-[#D97706] active:translate-y-[2px] transition-colors py-5 w-full flex justify-center items-center font-bold"
            >
              {!loading ? "Оформить" : <LoadingOutlined />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
