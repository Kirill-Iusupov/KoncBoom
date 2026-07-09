import { items } from "../mock/data";

export const promotionItems = items.filter((item) => item.prom);

export const popularItems = items.filter((item) => item.popular);
