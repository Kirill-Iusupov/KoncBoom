export type DataFormat = {
  title: string;
  description: string;
  id: number;
  count: number;
  icon: string;
};

export type ItemFormat = {
  brand: string;
  title: string;
  price: number | string;
  id: number;
  categorie: string;
  image: string;
  popular: boolean;
  promoInfo: IPromoInfo;
};

export type Product = {
  brand: string;
  categorie: string;
  id: number;
  image: string;
  popular: boolean;
  price: string;
  promoInfo: IPromoInfo;
  slug: string;
  stock: number;
  title: string;
};

export interface IPromoInfo {
  // Идет ли в данный момент акция на этот товар
  promo?: boolean;
  // Текст-эйбрика над заголовком, например "АКЦИЯ · ПИСЬМЕННЫЕ"
  eyebrow: string;
  // Заголовок акции
  title: string;
  // Описание условий акции
  description: string;
  // Размер скидки в процентах
  discount: number;
  starts_at: Date | string;
  ends_at: Date | string;
}

export type CategoriesResult = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  count: number;
};

export interface ResponseData<T> {
  count: number;
  next?: number | null;
  prev?: number | null;
  results: T[];
}

export type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  hasStarted: boolean;
};
