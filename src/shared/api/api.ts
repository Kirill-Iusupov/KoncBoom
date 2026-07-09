import { items } from "../mock/data";

export const promotionItems = items.filter((item) => item.promoInfo.promo);

export const popularItems = items.filter((item) => item.popular);
