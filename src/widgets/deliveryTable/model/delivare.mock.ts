export type TypedelivaryTable = {
    contractor: string
    region: string
    amount: string
    cost: string
}


export const delivaryTable = [
  {
    contractor: 'Юридическое лицо',
    region: 'г. Бишкек',
    amount: 'На любую сумму',
    cost: 'Бесплатно. Зона доставки: ул.Фучика - ул.Ауэзова, Южная Магистраль - ул.Куренкеева.',
  },
  {
    contractor: 'Юридическое лицо',
    region: 'За пределами зоны доставки, р-к Дордой',
    amount: 'от 5 000 с',
    cost: 'Бесплатно.',
  },
  {
    contractor: 'Физическое лицо',
    region: 'г. Бишкек',
    amount: 'От 2 500 сом',
    cost: 'Бесплатно. Зона доставки: ул.Фучика - ул.Ауэзова, Южная Магистраль - ул.Куренкеева.',
  },
  {
    contractor: 'Физическое лицо',
    region: 'За пределами г. Бишкек',
    amount: 'Менее 2 500 сом',
    cost: '400 сом',
  },
  {
    contractor: 'Физическое лицо',
    region: 'За пределами г. Бишкек',
    amount: 'от 4 500 с',
    cost: 'Платно, уточняйте у менеджера',
  },
];