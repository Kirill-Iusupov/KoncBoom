type DataFormat = {
  title: string;
  description: string;
  id: number;
  count?: number;
};

type ItemFormat = {
  brand: string;
  title: string;
  description?: string;
  price: number;
  id: number;
};

const categories: DataFormat[] = [
  {
    title: "Electronics",
    description: "Devices and gadgets",
    id: 1,
    count: 10,
  },
];

const promotions: DataFormat[] = [
  { title: "Summer Sale", description: "Up to 50% off", id: 1 },
];

const items: ItemFormat[] = [
  {
    brand: "",
    title: "",
    description: "",
    price: 0,
    id: 1,
  },
];
