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
  price: number;
  id: number;
  categorie: string;
  image: string;
  popular: boolean;
  promoInfo: IPromoCardProps;
};

export interface IPromoCardProps {
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
  // Ссылка, куда ведёт кнопка "Перейти"
  url?: string;
}

export type CategoriesResult = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  count: number;
};

export type Product = {
  brand: string;
  categorie: string;
  id: number;
  image: string;
  popular: boolean;
  price: string;
  promoInfo: {
    description: string;
    discount: number;
    eyebrow: string;
    promo: boolean;
    title: string;
    url: string;
  };
  slug: string;
  stock: number;
  title: string;
};

export interface ResponseData<T> {
  count: number;
  next?: number | null;
  prev?: number | null;
  results: T[];
}
