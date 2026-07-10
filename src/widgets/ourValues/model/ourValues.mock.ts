export type TypeValueCard = {
  id: number
  title: string
  description: string
  bgColor: string 
}

export const ourValues: TypeValueCard[] = [
  {
    id: 1,
    title: 'Качество',
    description: 'Продаём только то, что проверили сами. Никакой дешёвой продукции без гарантий.',
    bgColor: 'from-[#D4FC79] to-[#96E6A1]', 
  },
  {
    id: 2,
    title: 'Честность',
    description: 'Реальные цены, прозрачные условия доставки и возврата.',
    bgColor: 'from-[#E0C3FC] to-[#8EC5FC]', 
  },
  {
    id: 3,
    title: 'Скорость',
    description: 'Доставка по Бишкеку за 1 день. Отправляем в регионы в течение 2 рабочих дней.',
    bgColor: 'from-[#F6D365] to-[#FDA085]', 
  },
  {
    id: 4,
    title: 'Широкий выбор',
    description: 'От простой шариковой ручки до профессиональных художественных красок.',
    bgColor: 'from-[#16D9E3] via-[#30C7EC] to-[#46AEF7]', 
  },
];