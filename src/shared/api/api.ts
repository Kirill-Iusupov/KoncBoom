import axios from "axios";
import { items } from "../mock/data";

export const api = axios.create({
  baseURL: "http://localhost/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const promotionItems = items.filter((item) => item.promoInfo.promo);

export const popularItems = items.filter((item) => item.popular);
