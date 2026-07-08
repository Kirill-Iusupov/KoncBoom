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
  prom: boolean;
  promSize: number;
  categorie?: string;
  image: string;
  popular?: boolean;
};
