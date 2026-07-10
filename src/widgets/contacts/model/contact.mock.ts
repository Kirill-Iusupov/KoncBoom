export type TypeContact = {
  id: number
  title: string
  details: string
}

export const contacts:TypeContact[] = [
  {
    id: 1,
    title: 'Адрес',
    details: 'ул. Чуй 168, Бишкек\nРядом с ТЦ «Дом книги»',
  },
  {
    id: 2,
    title: 'Телефон',
    details: '+996 312 000 000\nПн-Сб: 9:00 – 19:00',
  },
  {
    id: 3,
    title: 'WhatsApp',
    details: '+996 700 000 000\nПринимаем заказы онлайн',
  },
  {
    id: 4,
    title: 'Оптовые заказы',
    details: 'Специальные условия для организаций\nПочта: opt@chemita.kg',
  },
];