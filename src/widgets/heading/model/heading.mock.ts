export type TypeHeading = {
    link: string
    main_info?: string
    title: string
    extra_info?: string
}

export const heading_items: TypeHeading[] = [
    {
        link:'/cart',
        title: 'Корзина',
    },
    {
        link: '/catalog',
        main_info: 'Каталог',
        title: 'Все товары',
        extra_info: '1 200+ позиций · ручки, карандаши, бумага, папки и многое другое',
    },
    {
        link: '/promotion',
        main_info: 'Специальные предложения',
        title: 'Акции и скидки',
        extra_info: 'Актуальные предложения — только ограниченное время',
    },
]

